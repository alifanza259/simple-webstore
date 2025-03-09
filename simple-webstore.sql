--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.8

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


ALTER TABLE public.knex_migrations OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.knex_migrations_id_seq OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


ALTER TABLE public.knex_migrations_lock OWNER TO postgres;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNER TO postgres;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    description text,
    category character varying(255),
    image text,
    stock integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    CONSTRAINT products_price_check CHECK ((price > (0)::numeric)),
    CONSTRAINT products_stock_check CHECK ((stock >= 0))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: stock_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_logs (
    id integer NOT NULL,
    product_id integer NOT NULL,
    activity character varying(255),
    changes integer NOT NULL,
    transaction_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stock_logs OWNER TO postgres;

--
-- Name: stock_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_logs_id_seq OWNER TO postgres;

--
-- Name: stock_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_logs_id_seq OWNED BY public.stock_logs.id;


--
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('public.knex_migrations_lock_index_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: stock_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_logs ALTER COLUMN id SET DEFAULT nextval('public.stock_logs_id_seq'::regclass);


--
-- Data for Name: knex_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knex_migrations (id, name, batch, migration_time) FROM stdin;
1	20250305025300_products.js	1	2025-03-09 10:27:47.454+00
2	20250306135230_stock_logs.js	1	2025-03-09 10:27:47.511+00
3	20250308081807_add_indexing.js	1	2025-03-09 10:27:47.565+00
4	20250308191446_add_products_soft_delete.js	1	2025-03-09 10:27:47.627+00
\.


--
-- Data for Name: knex_migrations_lock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knex_migrations_lock (index, is_locked) FROM stdin;
1	0
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, title, price, description, category, image, stock, created_at, updated_at, deleted_at) FROM stdin;
12	WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive	114.00	Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty	electronics	https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg	4	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
1	Kulkas BAa	51.00	\N	\N	\N	10	2025-03-09 10:28:17.898609	2025-03-09 10:28:17.898609	2025-03-09 10:28:45.684501
2	Mens Casual Premium Slim Fit T-Shirts 	22.30	Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.	men's clothing	https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
4	Mens Casual Slim Fit	15.99	The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.	men's clothing	https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
5	John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet	695.00	From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.	jewelery	https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
6	Solid Gold Petite Micropave 	168.00	Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.	jewelery	https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
7	White Gold Plated Princess	9.99	Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...	jewelery	https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
8	Pierced Owl Rose Gold Plated Stainless Steel Double	10.99	Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel	jewelery	https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
9	WD 2TB Elements Portable External Hard Drive - USB 3.0 	64.00	USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system	electronics	https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
10	SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s	109.00	Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)	electronics	https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
11	Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5	109.00	3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.	electronics	https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
13	Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin	599.00	21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port Zero-frame design | ultra-thin | 4ms response time | IPS panel Aspect ratio - 16: 9. Color Supported - 16. 7 million colors. Brightness - 250 nit Tilt angle -5 degree to 15 degree. Horizontal viewing angle-178 degree. Vertical viewing angle-178 degree 75 hertz	electronics	https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
14	Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED 	999.99	49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag	electronics	https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
15	BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats	56.99	Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates	women's clothing	https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
16	Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket	29.95	100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket, Button detail on waist / Detail stitching at sides, HAND WASH ONLY / DO NOT BLEACH / LINE DRY / DO NOT IRON	women's clothing	https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
17	Rain Jacket Women Windbreaker Striped Climbing Raincoats	39.99	Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn't overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.	women's clothing	https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
18	MBJ Women's Solid Short Sleeve Boat Neck V 	9.85	95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem	women's clothing	https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
19	Opna Women's Short Sleeve Moisture	7.95	100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort	women's clothing	https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
20	DANVOUY Womens T Shirt Casual Cotton Short	12.99	95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.	women's clothing	https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg	0	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
3	Mens Cotton Jacket	55.99	great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.	men's clothing	https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg	1	2025-03-09 10:28:59.547459	2025-03-09 10:28:59.547459	\N
\.


--
-- Data for Name: stock_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_logs (id, product_id, activity, changes, transaction_date) FROM stdin;
1	1	Insert Product	10	2025-03-09 10:28:17.898609
2	1	Remove Product	-10	2025-03-09 10:28:45.684501
3	2	Insert Product	0	2025-03-09 10:28:59.547459
4	3	Insert Product	0	2025-03-09 10:28:59.547459
5	4	Insert Product	0	2025-03-09 10:28:59.547459
6	5	Insert Product	0	2025-03-09 10:28:59.547459
7	6	Insert Product	0	2025-03-09 10:28:59.547459
8	7	Insert Product	0	2025-03-09 10:28:59.547459
9	8	Insert Product	0	2025-03-09 10:28:59.547459
10	9	Insert Product	0	2025-03-09 10:28:59.547459
11	10	Insert Product	0	2025-03-09 10:28:59.547459
12	11	Insert Product	0	2025-03-09 10:28:59.547459
13	12	Insert Product	0	2025-03-09 10:28:59.547459
14	13	Insert Product	0	2025-03-09 10:28:59.547459
15	14	Insert Product	0	2025-03-09 10:28:59.547459
16	15	Insert Product	0	2025-03-09 10:28:59.547459
17	16	Insert Product	0	2025-03-09 10:28:59.547459
18	17	Insert Product	0	2025-03-09 10:28:59.547459
19	18	Insert Product	0	2025-03-09 10:28:59.547459
20	19	Insert Product	0	2025-03-09 10:28:59.547459
21	20	Insert Product	0	2025-03-09 10:28:59.547459
22	3	Update Stock	1	2025-03-09 10:31:11.845545
23	12	Update Stock	4	2025-03-09 10:43:17.444032
\.


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knex_migrations_id_seq', 4, true);


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knex_migrations_lock_index_seq', 1, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 20, true);


--
-- Name: stock_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_logs_id_seq', 23, true);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: stock_logs stock_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_logs
    ADD CONSTRAINT stock_logs_pkey PRIMARY KEY (id);


--
-- Name: products_category_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_category_index ON public.products USING btree (category);


--
-- Name: stock_logs_product_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX stock_logs_product_id_index ON public.stock_logs USING btree (product_id);


--
-- PostgreSQL database dump complete
--

