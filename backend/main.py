from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import requests
import re
app = FastAPI()
import time

email_pattern = r'[\w.-]+@[\w.-]+'

def get_email(string):
    match = re.search(email_pattern, string)
    if match:
        return match.group(0)
    else:
        return None

@app.get("/repos/{owner}/{repo}")
async def get_repo(request: Request, owner: str, repo: str):
    start = time.time()
    octokit = requests.Session()
    octokit.headers.update({'Authorization': 'Bearer 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'})

    response = octokit.get(f'https://api.github.com/repos/{owner}/{repo}')
    contributors_url = response.json()['contributors_url']
    contributors = octokit.get(contributors_url)

    user_url = []
    for contributor in contributors.json():
        res = octokit.get(contributor['url'])
        user = res.json()

        email = user['email']
        if not email:
            if user['bio']:
                email = get_email(user['bio'])
        if not email:
            readme_res = requests.get(f'https://raw.githubusercontent.com/{owner}/{owner}/main/README.md')
            email = get_email(readme_res.text)
        repos_res = octokit.get(user['repos_url'])

        repos = repos_res.json()

        languages_map = dict()
        for repo in repos:
            if repo['language'] not in languages_map:
                languages_map[repo['language']] = 1
            else:
                languages_map[repo['language']] += 1
        languages = list(filter(lambda item: item is not None, list(map(lambda x: x[0], sorted(languages_map.items(), key=lambda x: x[1], reverse=True)))))

        if len(languages) == 0:
             continue
        user_data = {'commits': contributor['contributions'], 'createdAt': user['created_at'], 'followers': user['followers'],
                    'fullName': user['name'], 'languages': languages, 'location': user['location'],
                    'photoSrc': user['avatar_url'], 'profileSrc': user['html_url'], 'email': email}
        user_url.append(user_data)
    end = time.time()
    print(end - start)
    return JSONResponse(status_code=response.status_code, content=user_url)