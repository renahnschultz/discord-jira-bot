import { buscarIssue, buscarIssues } from "./utils.js"
import _ from 'lodash'

export const qtdbugs = async (message) => {
    const jql = "type = Erro AND status in ('Em análise', 'Não iniciado')"
    var bugs = await buscarIssues(encodeURIComponent(jql))
    var total = {}
    bugs.issues.forEach(bug => {
        var key = bug.fields.project.key.toLowerCase()
        if (total[key]) {
            total[key] += 1
        } else {
            total[key] = 1
        }
    });
    message.channel.send(`
        Atualmente temos ${bugs.total} bugs não resolvidos.\n
        Promotor Freelance: ${total.pf} bugs.\n
        TradePro: ${total.trad} bugs.\n
        Clube da Venda: ${total.cdv} bugs.\n
        E-Commerce: ${total.ec ?? 0} bugs.\n
        `);
}

export const jql = async (message, metric, query) => {
    if (metric === 'count') {
        buscarIssues(encodeURIComponent(query)).then(issues => {
            message.channel.send(`Foram encontradas ${issues.total} issues com os parâmetros passados.`)
        }).catch(erro => {
            message.channel.send(`${erro.erro} (Possívelmente há algum problema com a query solicitada)`)
        })
    }
    if (metric === 'hours') {
        buscarIssues(encodeURIComponent(query)).then(issues => {
            var time = (_.reduce(issues.issues, (acc, issue) => { return acc + parseFloat(issue.fields.aggregatetimeoriginalestimate ?? 0) }, 0) / 3600).toFixed(2)
            message.channel.send(`Foram encontradas ${issues.total} issues com os parâmetros passados. Totalizando ${time} horas para resolução.`)
        }).catch(erro => {
            message.channel.send(`${erro.erro} (Possívelmente há algum problema com a query solicitada)`)
        })
    }
}

export const info = async (message, key) => {
    buscarIssue(key).then(issue => {
        var fields = issue.fields;
        message.channel.send({
            "embed": {
                "title": `[${issue.key}] ${fields.summary}`,
                "color": 419275,
                "description": `${fields.project.name}
                ${fields.issuetype.name} - ${fields.status.name}
                
                ${fields.description?.content?.[0]?.content?.[0]?.text ?? ''}`,
                "timestamp": fields.created,
                thumbnail: {
                    url: fields.project.avatarUrls["48x48"],
                },
                "author": {
                    "name": fields.assignee.displayName,
                    "icon_url": fields.assignee.avatarUrls["24x24"]
                },
                "footer": {
                    "text": fields.creator.displayName,
                    "icon_url": fields.creator.avatarUrls["24x24"]
                },
                "fields": []
            }
        })
    }).catch(erro => {
        console.log(erro)
        message.channel.send(`${erro.erro} (Possívelmente há algum problema com a query solicitada)`)
    })
}