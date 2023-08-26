(async () => {

    const database = require('./db');
    const New_Client = require('./new_client');
    const CNAE = require('./cnae');
    await database.sync();

    const fs = require('fs');
    const axios = require("axios").default;

    //lendo o txt
    fs.readFile('ativos.txt', 'utf-8', async (err, data) => {
        let linhas = data.split(/\r?\n/);
        let i = 0;
        const dateOpen = "202306";
        let count = 1;
        let infos = [];

        for (let index = 0; index < linhas.length; index++) {
            const linha = linhas[index];

            if (i == 0) {
                const titlesGrid = String(linha).split(";");
            } else {
                // vai fazer consultas a cada 20sec
                const detail = linha.split(";");
                const codCNAE = detail[5];
                const CNPJ = String(detail[1].padStart(14, "0"));
                console.log(codCNAE);

                if (detail[2] == dateOpen && CNAE.find((cod) => cod = codCNAE)) {

                    const clients = await New_Client.findAll({
                        where: { cnpj: CNPJ }
                    })
                    const client = JSON.parse(JSON.stringify(clients))
                    if (client.length == 0) {

                        await sleep(20000);


                        console.log(`https://receitaws.com.br/v1/cnpj/${CNPJ}`)
                        const receita = await axios.get(`https://receitaws.com.br/v1/cnpj/${CNPJ}`)

                        if (receita) {
                            if (receita.data) {

                                const emp = receita.data;
                                // console.log(receita.data)

                                New_Client.create({
                                    name: emp.nome,
                                    cnpj: CNPJ,
                                    fone: emp.telefone,
                                    email: emp.email,
                                    socio: emp.qsa.length > 0 ? emp.qsa[0].nome : "Não encontrado",
                                    municipio: emp.municipio,
                                    isSendMail: false
                                }).then(client => {
                                    console.log(client)
                                }).catch(error => {
                                    console.log(error)
                                });
                            }
                        } else {
                            console.log("Erro Consulta")
                        }
                    }
                }
            }
            i++
        }
    })

    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        })
    }

})();

