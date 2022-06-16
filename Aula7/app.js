const express = require("express");
const Usuario = require('./models/Usuario');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());

app.get("/users", async(req, res) => {

    await Usuario.findAll({
            attributes: ['id', 'nome', 'sobrenome', 'cargo', 'email', 'password'],
            order: [
                ['id', 'DESC']
            ]
        })
        .then((users) => {
            return res.json({
                erro: false,
                users
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum usuário encontrado!"
            });
        });
});

app.get("/user/:id", async(req, res) => {
    const id = req.params.id;

    //await Usuario.findAll({ where: { id: id } })
    await Usuario.findByPk(id)
        .then((user) => {
            return res.json({
                erro: false,
                user: user
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum usuário encontrado!"
            });
        });
});

app.post("/user", async(req, res) => {
    //var (não mais 'CONST') nome = req.body.nome;   
    //var (não mais 'CONST') email = req.body.email;
    //const não se muda, var se muda;

    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);

    await Usuario.create(dados).
    then(() => {
        return res.json({
            erro: false,
            mensagem: "Usuário cadastrado com sucesso!"
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário não cadastrado!"
        });
    });
});

app.put("/user", async(req, res) => {
    const { id, nome, sobrenome, cargo, email } = req.body;

    await Usuario.update(req.body, { where: { id: id } })
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Usuário editado com sucesso!"
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Usuário não editado!"
            });
        })
});

app.put("/user-senha", async(req, res) => {
    //para edição de senhas;
    const id = req.body.id;
    const password = req.body.password;

    var senhaCrypt = await bcrypt.hash(password, 8);

    await Usuario.update({ password: senhaCrypt }, { where: { id } })
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Senha editada com sucesso!"
            });

        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Senha não editada!"
            });
        });
});

app.delete("/user/:id", async(req, res) => {
    const id = req.params.id;

    await Usuario.destroy({ where: { id: id } })
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Usuário apagado com sucesso!"
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Usuário não apagado!"
            });
        })
})


app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});