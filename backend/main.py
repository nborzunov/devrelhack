from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import re
import time
import uvicorn
from bs4 import BeautifulSoup
from multiprocessing import Pool
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

email_pattern = r'[\w.-]+@[\w.-]+'

count_pattern = r'Contributors <span title="(.+?)"'


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

def get_contributor(contributor, octokit):
    res = octokit.get(contributor['url'])
    
    user = res.json()

    email = user['email']
    # if not email:
    #     if user['bio']:
    #         email = get_email(user['bio'])
    # if not email:
    #     readme_res = requests.get(f'https://raw.githubusercontent.com/{owner}/{owner}/main/README.md')
    #     email = get_email(readme_res.text)
    # repos_res = octokit.get(user['repos_url'])

    # repos = repos_res.json()
    name = user['login']

    def get_languages(name, octokit):
        repos_res = octokit.get(user['repos_url'])

        languages_map = dict()
        for repo in repos_res.json():
            if repo['language'] not in languages_map:
                languages_map[repo['language']] = 1
            else:
                languages_map[repo['language']] += 1
        languages = list(filter(lambda item: item is not None, list(map(lambda x: x[0], sorted(languages_map.items(), key=lambda x: x[1], reverse=True)))))

        return languages
    languages = get_languages(name, octokit)
    user = {'commits': contributor['contributions'], 'createdAt': user['created_at'], 'followers': user['followers'],
                    'fullName': user['name'], 'languages': languages, 'location': user['location'],
                    'photoSrc': user['avatar_url'], 'profileSrc': user['html_url'], 'email': email}
    return user
   

@app.get("/repos/{owner}/{repo}")
async def get_repo(request: Request, owner: str, repo: str):
    root_start = time.time()
    octokit = requests.Session()
    octokit.headers.update({'Authorization': 'Bearer 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'})
    
    response = octokit.get(f'https://api.github.com/repos/{owner}/{repo}')
    repo_res = requests.get(f'https://github.com/{owner}/{repo}')

    count = get_count(repo_res.text)

    print(count)
    
    contributors_url = response.json()['contributors_url']
    users = []
    page = 0

    while page < count // 100:
        contributors = octokit.get(f'{contributors_url}?per_page=100&page={page + 1}')

        with Pool(60) as p:
            copier = functools.partial(get_contributor, octokit=octokit)
            result = p.map(copier, contributors.json())
            users.append(result)

        if len(contributors.json()) != 100:
            break
            
        page += 1;
    root_end = time.time()
    print(root_end - root_start)

    return JSONResponse(status_code=response.status_code, content={'data': users, 'count': count})


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)