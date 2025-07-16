--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-16 21:00:51

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16390)
-- Name: participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participants (
    id integer NOT NULL,
    full_name character varying(255),
    birth_date date,
    role character varying(50),
    email character varying(100),
    phone character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.participants OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16389)
-- Name: participants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.participants_id_seq OWNER TO postgres;

--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 217
-- Name: participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.participants_id_seq OWNED BY public.participants.id;


--
-- TOC entry 4742 (class 2604 OID 16397)
-- Name: participants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants ALTER COLUMN id SET DEFAULT nextval('public.participants_id_seq'::regclass);


--
-- TOC entry 4892 (class 0 OID 16390)
-- Dependencies: 218
-- Data for Name: participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.participants (id, full_name, birth_date, role, email, phone, created_at) FROM stdin;
2	Иванов Иван Иванович	1990-05-01	Контролер	ivanov@example.com	+79991234567	2025-07-14 16:12:49.982128
3	Петров Пётр Иванович	1990-05-01	Контролер	ivanov@example.com	+79991234567	2025-07-14 16:16:00.029589
4	Башкатов	1997-11-11	Инженер	test2221@gmail.com	+79312513113	2025-07-14 17:18:15.903423
5	Башкатов	1997-11-11	Инженер	de24243is+1@li42ve.ru	894315411245	2025-07-14 17:42:50.277778
6	Тестов Тест	1990-01-01	Контролер	test@example.com	+79990001122	2025-07-16 15:20:19.326722
7	Тестов Тест 2 	1990-01-01	Контролер	test@example.com	+79990001122	2025-07-16 15:27:17.81545
8	Тестов Тест 3 	1990-01-01	Контролер	test@example.com	+79990001122	2025-07-16 15:47:14.38204
9	Тестов Тест 4 	1990-01-01	Контролер	test@example.com	+79990001122	2025-07-16 15:48:15.527187
10	Тестов Тест 5 	1990-01-01	Контролер	test@example.com	+79990001122	2025-07-16 15:49:38.865226
11	Тестов Тест 7 	1990-01-01	Контролер	test@example.com	+79990001122	2025-07-16 15:55:47.943789
12	Рыжов Рыжий	1998-11-11	Инженер	4vasiliev@stroy111control.ru	+79101234111	2025-07-16 16:49:38.312947
13	Рыжов Рыжий 2	1998-11-11	Инженер	wewwqe111@mail.ru	+7 (953) 165-1111	2025-07-16 17:11:15.641013
14	Рыжов Рыжий 	1998-11-11	Инженер	wewwqe111@mail.ru	+7 (953) 165-1111	2025-07-16 17:14:49.931505
15	Рыжов Рыжий 2	1998-11-11	Инженер	wewwqe111@mail.ru	+7 (953) 165-1111	2025-07-16 17:15:29.334792
16	Рыжов Рыжий 2	1998-11-11	Инженер	wewwqe111@mail.ru	+7 (953) 165-1111	2025-07-16 17:15:41.936527
17	Рыжов Рыжий 5	1998-11-11	Инженер	4vasi2323liev@stroycontrol.ru	+79105678901	2025-07-16 17:18:05.121443
18	Рыжов Рыжий	1998-12-15	Инженер	wewwqe2321@mail.ru	+79999999999	2025-07-16 17:29:00.983921
\.


--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 217
-- Name: participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.participants_id_seq', 18, true);


--
-- TOC entry 4745 (class 2606 OID 16396)
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


-- Completed on 2025-07-16 21:00:51

--
-- PostgreSQL database dump complete
--

