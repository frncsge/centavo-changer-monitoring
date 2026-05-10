--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: dispense_machine_storage(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.dispense_machine_storage() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	m_id INT;
BEGIN
	-- get machine_id first
	SELECT machine_id INTO m_id
	FROM transactions
	WHERE transaction_id = NEW.transaction_id;
	
	UPDATE machine_storage
	SET quantity = machine_storage.quantity - NEW.quantity
	WHERE machine_id = m_id AND peso_value = NEW.peso_value;

	RETURN NEW;
END;
$$;


--
-- Name: refill_machine_storage(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.refill_machine_storage() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	m_id INT;
BEGIN
	-- get the machine_id first
	SELECT machine_id INTO m_id 
	FROM refills
	WHERE refill_id = NEW.refill_id;
	
	INSERT INTO machine_storage (machine_id, peso_value, quantity)
	VALUES (m_id, NEW.peso_value, NEW.quantity)
	ON CONFLICT (machine_id, peso_value)
	DO UPDATE
	SET quantity = machine_storage.quantity + EXCLUDED.quantity;

	RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    admin_id integer NOT NULL,
    account_name character varying(100)
);


--
-- Name: admins_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admins_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admins_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admins_admin_id_seq OWNED BY public.admins.admin_id;


--
-- Name: machine_storage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.machine_storage (
    machine_id integer NOT NULL,
    peso_value integer NOT NULL,
    quantity integer DEFAULT 0 NOT NULL
);


--
-- Name: machines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.machines (
    machine_id integer NOT NULL,
    location text NOT NULL,
    status character varying(100),
    admin_id integer
);


--
-- Name: machines_machine_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.machines_machine_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: machines_machine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.machines_machine_id_seq OWNED BY public.machines.machine_id;


--
-- Name: peso_dispensed; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.peso_dispensed (
    transaction_id integer NOT NULL,
    peso_value integer NOT NULL,
    quantity integer
);


--
-- Name: peso_refilled; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.peso_refilled (
    refill_id integer NOT NULL,
    peso_value integer NOT NULL,
    quantity integer
);


--
-- Name: refills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refills (
    refill_id integer NOT NULL,
    machine_id integer,
    refill_date_time timestamp without time zone DEFAULT now()
);


--
-- Name: refills_refill_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refills_refill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refills_refill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refills_refill_id_seq OWNED BY public.refills.refill_id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    transaction_id integer NOT NULL,
    machine_id integer,
    transaction_date_time timestamp without time zone DEFAULT now(),
    centavos_25_inserted integer
);


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transactions_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transactions_transaction_id_seq OWNED BY public.transactions.transaction_id;


--
-- Name: admins admin_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins ALTER COLUMN admin_id SET DEFAULT nextval('public.admins_admin_id_seq'::regclass);


--
-- Name: machines machine_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.machines ALTER COLUMN machine_id SET DEFAULT nextval('public.machines_machine_id_seq'::regclass);


--
-- Name: refills refill_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refills ALTER COLUMN refill_id SET DEFAULT nextval('public.refills_refill_id_seq'::regclass);


--
-- Name: transactions transaction_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions ALTER COLUMN transaction_id SET DEFAULT nextval('public.transactions_transaction_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admins (admin_id, account_name) FROM stdin;
\.


--
-- Data for Name: machine_storage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.machine_storage (machine_id, peso_value, quantity) FROM stdin;
\.


--
-- Data for Name: machines; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.machines (machine_id, location, status, admin_id) FROM stdin;
\.


--
-- Data for Name: peso_dispensed; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.peso_dispensed (transaction_id, peso_value, quantity) FROM stdin;
\.


--
-- Data for Name: peso_refilled; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.peso_refilled (refill_id, peso_value, quantity) FROM stdin;
\.


--
-- Data for Name: refills; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.refills (refill_id, machine_id, refill_date_time) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.transactions (transaction_id, machine_id, transaction_date_time, centavos_25_inserted) FROM stdin;
\.


--
-- Name: admins_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admins_admin_id_seq', 2, true);


--
-- Name: machines_machine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.machines_machine_id_seq', 7, true);


--
-- Name: refills_refill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.refills_refill_id_seq', 2, true);


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transactions_transaction_id_seq', 6, true);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);


--
-- Name: machine_storage machine_storage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.machine_storage
    ADD CONSTRAINT machine_storage_pkey PRIMARY KEY (machine_id, peso_value);


--
-- Name: machines machines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.machines
    ADD CONSTRAINT machines_pkey PRIMARY KEY (machine_id);


--
-- Name: peso_dispensed peso_dispensed_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peso_dispensed
    ADD CONSTRAINT peso_dispensed_pkey PRIMARY KEY (transaction_id, peso_value);


--
-- Name: peso_refilled peso_refilled_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peso_refilled
    ADD CONSTRAINT peso_refilled_pkey PRIMARY KEY (refill_id, peso_value);


--
-- Name: refills refills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refills
    ADD CONSTRAINT refills_pkey PRIMARY KEY (refill_id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: peso_dispensed dispense_machine_storage; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER dispense_machine_storage AFTER INSERT ON public.peso_dispensed FOR EACH ROW EXECUTE FUNCTION public.dispense_machine_storage();


--
-- Name: peso_refilled trigger_update_machine_storage; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_machine_storage AFTER INSERT ON public.peso_refilled FOR EACH ROW EXECUTE FUNCTION public.refill_machine_storage();


--
-- Name: machine_storage fk_machine_id_peso_value; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.machine_storage
    ADD CONSTRAINT fk_machine_id_peso_value FOREIGN KEY (machine_id) REFERENCES public.machines(machine_id);


--
-- Name: machines fk_machines_admin; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.machines
    ADD CONSTRAINT fk_machines_admin FOREIGN KEY (admin_id) REFERENCES public.admins(admin_id);


--
-- Name: machine_storage machine_storage_machine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.machine_storage
    ADD CONSTRAINT machine_storage_machine_id_fkey FOREIGN KEY (machine_id) REFERENCES public.machines(machine_id);


--
-- Name: peso_dispensed peso_dispensed_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peso_dispensed
    ADD CONSTRAINT peso_dispensed_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(transaction_id);


--
-- Name: peso_refilled peso_refilled_refill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peso_refilled
    ADD CONSTRAINT peso_refilled_refill_id_fkey FOREIGN KEY (refill_id) REFERENCES public.refills(refill_id);


--
-- Name: refills refills_machine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refills
    ADD CONSTRAINT refills_machine_id_fkey FOREIGN KEY (machine_id) REFERENCES public.machines(machine_id);


--
-- Name: transactions transactions_machine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_machine_id_fkey FOREIGN KEY (machine_id) REFERENCES public.machines(machine_id);


--
-- PostgreSQL database dump complete
--

