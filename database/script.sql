-- BookStore Manager CLI - Banco de dados PostgreSQL

SET client_encoding = 'UTF8';

-- 1. CRIAÇÃO DA ESTRUTURA (DDL)

DROP TABLE IF EXISTS emprestimos CASCADE;
DROP TABLE IF EXISTS livros CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS autores CASCADE;

CREATE TABLE autores (
    id             SERIAL       PRIMARY KEY,
    nome           VARCHAR(100) NOT NULL UNIQUE,
    nacionalidade  VARCHAR(50)  NOT NULL
);

CREATE TABLE livros (
    id                    SERIAL       PRIMARY KEY,
    titulo                VARCHAR(150) NOT NULL,
    autor_id              INTEGER      NOT NULL,
    ano_publicacao        INTEGER      NOT NULL,
    quantidade_total      INTEGER      NOT NULL,
    quantidade_disponivel INTEGER      NOT NULL,
    CONSTRAINT fk_livros_autor FOREIGN KEY (autor_id) REFERENCES autores (id),
    CONSTRAINT uq_livros_titulo_autor UNIQUE (titulo, autor_id),
    CONSTRAINT ck_livros_ano CHECK (ano_publicacao >= 1000),
    CONSTRAINT ck_livros_total CHECK (quantidade_total > 0),
    CONSTRAINT ck_livros_disponivel CHECK (
        quantidade_disponivel >= 0 AND quantidade_disponivel <= quantidade_total
    )
);

CREATE TABLE clientes (
    id        SERIAL       PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    email     VARCHAR(150) NOT NULL UNIQUE,
    telefone  VARCHAR(20)
);

CREATE TABLE emprestimos (
    id               SERIAL  PRIMARY KEY,
    livro_id         INTEGER NOT NULL,
    cliente_id       INTEGER NOT NULL,
    data_emprestimo  DATE    NOT NULL DEFAULT CURRENT_DATE,
    data_devolucao   DATE,
    CONSTRAINT fk_emprestimos_livro   FOREIGN KEY (livro_id)   REFERENCES livros (id),
    CONSTRAINT fk_emprestimos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes (id),
    CONSTRAINT ck_emprestimos_datas CHECK (
        data_devolucao IS NULL OR data_devolucao >= data_emprestimo
    )
);