import { buscarIssues } from "./utils.js"

export const qtdbugs = async (message) => {
    const jql = "type = Erro AND status in ('Em análise', 'Não iniciado')"
    var bugs = await buscarIssues(encodeURIComponent(jql)).then(json => json)
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