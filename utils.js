import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()
const heroku_cors = 'https://cors-diego.herokuapp.com/'
const domain = 'https://mobilesys.atlassian.net/rest/api/3';
const token = Buffer.from(`${process.env.EMAIL}:${process.env.TOKEN_JIRA}`).toString('base64');

export const buscarIssues = (query) => {
    var url = `/search?maxResults=500&jql=${query}`
    return chamarJiraAPI(url)
}

export const buscarIssue = (key) => {
    var url = `/issue/${key}`
    return chamarJiraAPI(url)
}

export const chamarJiraAPI = (url) => new Promise((resolve, reject) => {
    fetch(heroku_cors + `${domain}/${url}`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${token}`,
            'Content-Type': 'application/json;charset=iso-8859-1',
            'origin': '*'
        },
    }).then(response => {
        if (response.status !== 200) {
            reject({ issues: [], total: 0, erro: 'Problema ao conectar ao jira.' })
        }
        resolve(response.json())
    }).catch(response => {
        reject({ issues: [], total: 0, erro: 'Problema ao conectar ao jira.' })
    })
})