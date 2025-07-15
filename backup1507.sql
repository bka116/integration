--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-07-15 09:38:05

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
-- TOC entry 4797 (class 0 OID 0)
-- Dependencies: 217
-- Name: participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.participants_id_seq OWNED BY public.participants.id;


--
-- TOC entry 4641 (class 2604 OID 16393)
-- Name: participants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants ALTER COLUMN id SET DEFAULT nextval('public.participants_id_seq'::regclass);


--
-- TOC entry 4791 (class 0 OID 16390)
-- Dependencies: 218
-- Data for Name: participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.participants (id, full_name, birth_date, role, email, phone, created_at) FROM stdin;
1	Иванов Иван Иванович	1990-05-01	Контролер	ivanov@example.com	+79991234567	2025-07-14 15:27:02.431756
2	Иванов Иван Иванович	1990-05-01	Контролер	ivanov@example.com	+79991234567	2025-07-14 16:12:49.982128
3	Петров Пётр Иванович	1990-05-01	Контролер	ivanov@example.com	+79991234567	2025-07-14 16:16:00.029589
4	Башкатов	1997-11-11	Инженер	test2221@gmail.com	+79312513113	2025-07-14 17:18:15.903423
5	Башкатов	1997-11-11	Инженер	de24243is+1@li42ve.ru	894315411245	2025-07-14 17:42:50.277778
\.


--
-- TOC entry 4798 (class 0 OID 0)
-- Dependencies: 217
-- Name: participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.participants_id_seq', 5, true);


--
-- TOC entry 4644 (class 2606 OID 16396)
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


-- Completed on 2025-07-15 09:38:05

--
-- PostgreSQL database dump complete
--

