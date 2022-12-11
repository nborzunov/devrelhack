from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import re
import time
import uvicorn
from multiprocessing import Pool, Process, Manager, Value
import functools


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

email_pattern = r"[\w.-]+@[\w.-]+"

count_pattern = r'Contributors <span title="(.+?)"'

excluded_users = ["github-actions", "dependabot", "dependabot-preview", "dependabot[bot]"]

def get_email(string):
    match = re.search(email_pattern, string)
    if match:
        return match.group(0)
    else:
        return None


def get_count(string):
    match = re.search(count_pattern, string)
    if match:
        return int(match.group(1).replace(",", ""))
    else:
        return 0


def get_languages(octokit, user):
    repos_res = octokit.get(user["repos_url"])

    languages_map = dict()
    for repo in repos_res.json():
        if repo["language"] not in languages_map:
            languages_map[repo["language"]] = 1
        else:
            languages_map[repo["language"]] += 1

    return languages_map


def get_contributor(contributor, octokit, owner, locations_map, languages_map, activities_map):
    res = octokit.get(contributor["url"])
    user = res.json()
    email = user["email"]

    # Calc locations 
    if user["location"] not in locations_map:
        locations_map[user["location"]] = 1
    else:
        locations_map[user["location"]] += 1

    # Calc email
    if not email:
        if user["bio"]:
            email = get_email(user["bio"])
    if not email:
        readme_res = requests.get(
            f"https://raw.githubusercontent.com/{owner}/{owner}/main/README.md"
        )
        email = get_email(readme_res.text)


    # Calc languages
    user_languages_map = get_languages(octokit, user)

    for k, v in user_languages_map.items():
        if k in user_languages_map and k in languages_map:
            languages_map[k] += 1
        elif k in user_languages_map:
            languages_map[k] = 1

    languages = list(
        filter(
            lambda item: item is not None,
            list(
                map(
                    lambda x: x[0],
                    sorted(user_languages_map.items(), key=lambda x: x[1], reverse=True),
                )
            ),
        )
    )
    if len(languages) == 0:
        return

    # Calc activity
    activity = 'High'
    contributions = int(contributor["contributions"])
    print(contributions)
    if contributions > 100:
        activity = 'High'
    elif contributions > 50:
        activity = 'Medium'
    else:
        activity = 'Low'
    
    activities_map[activity] += 1

    user = {
        "commits": contributor["contributions"],
        "createdAt": user["created_at"],
        "followers": user["followers"],
        "fullName": user["name"],
        "location": user["location"],
        "photoSrc": user["avatar_url"],
        "profileSrc": user["html_url"],
        "activity": activity,
        "languages": languages,
        "email": email,
    }
    return user


def get_users(count, octokit, contributors_url, owner, data, length, locations, languages, activities):
    users = []
    page = 0
    users_len = 0

    locations_map = Manager().dict()
    languages_map = Manager().dict()
    activities_map = Manager().dict({"High": 0, "Medium": 0, "Low": 0})

    while page < count // 100:
        contributors = octokit.get(f"{contributors_url}?per_page=100&page={page + 1}")

        with Pool(60) as p:
            copier = functools.partial(get_contributor, octokit=octokit, owner=owner, locations_map=locations_map, languages_map=languages_map, activities_map=activities_map)
            res = list(filter(lambda x: x is not None, p.map(copier, contributors.json())))
            users.extend(res)
            users_len += len(res)

        if len(contributors.json()) != 100:
            break

        page += 1

    locations.extend(list(
        filter(
             lambda item: item[1] is not None and item[0] is not None,
             sorted(locations_map.items(), key=lambda x: x[1], reverse=True)
             ))
         )

    languages.extend(list(
        filter(
             lambda item: item[1] is not None and item[0] is not None,
             sorted(languages_map.items(), key=lambda x: x[1], reverse=True)
             )))
    
    activities.extend(list(sorted(activities_map.items(), key=lambda x: x[1], reverse=True)))

    data.extend(users)
    length.value = users_len


@app.get("/repos/{owner}/{repo}")
async def get_repo(request: Request, owner: str, repo: str):
    root_start = time.time()
    octokit = requests.Session()
    octokit.headers.update(
        {"Authorization": "Bearer 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"}
    )

    response = octokit.get(f"https://api.github.com/repos/{owner}/{repo}")
    repo_res = requests.get(f"https://github.com/{owner}/{repo}")

    count = get_count(repo_res.text)
    contributors_url = response.json()["contributors_url"]

    manager = Manager()
    data = manager.list()
    length = Value('i', 0)
    locations = manager.list()
    languages = manager.list()
    activities = manager.list()
    

    p = Process(
        target=get_users, args=(count, octokit, contributors_url, owner, data, length, locations, languages, activities)
    )
    p.start()
    p.join()

    root_end = time.time()
    print(root_end - root_start)

    return JSONResponse(
        status_code=response.status_code,
        content={"data": list(data), "count": length.value, "locations": list(locations), "languages": list(languages), "activities": list(activities)},
    )


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)
