from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import requests

app = FastAPI()

@app.get("/repos/{owner}/{repo}")
async def get_repo(request: Request, owner: str, repo: str):
    octokit = requests.Session()
    octokit.headers.update({'Authorization': 'Bearer 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'})
    #octokit.auth = ('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')

    response = octokit.get(f'https://api.github.com/repos/{owner}/{repo}')
    contributors_url = response.json()['contributors_url']
    contributors = octokit.get(contributors_url)
    user_url = []
    for contributor in contributors.json():
        res = octokit.get(contributor['url'])
        user = res.json()
        user_data = {'commits': contributor['contributions'], 'createdAt': user['created_at'], 'followers': user['followers'],
                     'fullName': user['name'], 'languages': [], 'location': user['location'],
                     'photoSrc': user['avatar_url'], 'profileSrc': user['html_url']}
        user_url.append(user_data)

    return JSONResponse(status_code=response.status_code, content=user_url)