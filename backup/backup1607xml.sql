--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-16 21:00:29

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
-- TOC entry 218 (class 1259 OID 16400)
-- Name: xml_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.xml_participants (
    id integer NOT NULL,
    full_name character varying(255),
    birth_date date,
    role character varying(50),
    email character varying(100),
    phone character varying(20),
    xml_file_name character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.xml_participants OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16399)
-- Name: xml_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.xml_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.xml_participants_id_seq OWNER TO postgres;

--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 217
-- Name: xml_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.xml_participants_id_seq OWNED BY public.xml_participants.id;


--
-- TOC entry 4742 (class 2604 OID 16403)
-- Name: xml_participants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.xml_participants ALTER COLUMN id SET DEFAULT nextval('public.xml_participants_id_seq'::regclass);


--
-- TOC entry 4892 (class 0 OID 16400)
-- Dependencies: 218
-- Data for Name: xml_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.xml_participants (id, full_name, birth_date, role, email, phone, xml_file_name, created_at) FROM stdin;
1	Рыжов Рыжий 2	1998-11-11	Инженер	wewwqe111@mail.ru	+7 (953) 165-1111	received_1752675329097.xml	2025-07-16 17:15:29.151324
2	Рыжов Рыжий 2	1998-11-11	Инженер	wewwqe111@mail.ru	+7 (953) 165-1111	received_1752675329520.xml	2025-07-16 17:15:29.563759
3	Рыжов Рыжий 2	1998-11-11	Инженер	wewwqe111@mail.ru	+7 (953) 165-1111	received_1752675341681.xml	2025-07-16 17:15:41.737852
4	Рыжов Рыжий 2	1998-11-11	Инженер	wewwqe111@mail.ru	+7 (953) 165-1111	received_1752675342116.xml	2025-07-16 17:15:42.274877
5	Рыжов Рыжий 5	1998-11-11	Инженер	4vasi2323liev@stroycontrol.ru	+79105678901	received_1752675485002.xml	2025-07-16 17:18:05.051859
\.


--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 217
-- Name: xml_participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.xml_participants_id_seq', 5, true);


--
-- TOC entry 4745 (class 2606 OID 16408)
-- Name: xml_participants xml_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.xml_participants
    ADD CONSTRAINT xml_participants_pkey PRIMARY KEY (id);


-- Completed on 2025-07-16 21:00:29

--
-- PostgreSQL database dump complete
--

