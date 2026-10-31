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


-- 2. MANIPULAÇÃO DE DADOS (DML)


INSERT INTO autores (id, nome, nacionalidade) VALUES
    (1, 'Machado de Assis', 'Brasileira'),
    (2, 'Clarice Lispector', 'Brasileira'),
    (3, 'George Orwell', 'Britânica');

INSERT INTO livros (id, titulo, autor_id, ano_publicacao, quantidade_total, quantidade_disponivel) VALUES
    (1, 'Dom Casmurro', 1, 1899, 3, 2),
    (2, 'Memórias Póstumas de Brás Cubas', 1, 1881, 2, 2),
    (3, 'A Hora da Estrela', 2, 1977, 2, 1),
    (4, '1984', 3, 1949, 4, 4);

INSERT INTO clientes (id, nome, email, telefone) VALUES
    (1, 'Ana Souza', 'ana@email.com', '47 99999-1111'),
    (2, 'Bruno Lima', 'bruno@email.com', '47 99999-2222'),
    (3, 'Carla Mendes', 'carla@email.com', '47 99999-3333');

INSERT INTO emprestimos (id, livro_id, cliente_id, data_emprestimo, data_devolucao) VALUES
    (1, 1, 1, '2026-10-20', NULL),
    (2, 3, 2, '2026-10-22', NULL),
    (3, 2, 3, '2026-10-10', '2026-10-17');


SELECT setval(pg_get_serial_sequence('autores', 'id'),      (SELECT MAX(id) FROM autores));
SELECT setval(pg_get_serial_sequence('livros', 'id'),       (SELECT MAX(id) FROM livros));
SELECT setval(pg_get_serial_sequence('clientes', 'id'),     (SELECT MAX(id) FROM clientes));
SELECT setval(pg_get_serial_sequence('emprestimos', 'id'),  (SELECT MAX(id) FROM emprestimos));

UPDATE clientes
   SET telefone = '47 98888-1111'
 WHERE id = 1;

 UPDATE livros
   SET quantidade_total = 5,
       quantidade_disponivel = 5
 WHERE id = 4;

 INSERT INTO autores (nome, nacionalidade) VALUES ('Autor Temporário', 'Desconhecida');
DELETE FROM autores WHERE nome = 'Autor Temporário';

