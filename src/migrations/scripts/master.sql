PGDMP     &                    x            push    12.1    12.1                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    19940    push    DATABASE     �   CREATE DATABASE push WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
    DROP DATABASE push;
                postgres    false            �            1259    19943    device    TABLE     �   CREATE TABLE public.device (
    id bigint NOT NULL,
    device_platform text,
    device_id bigint,
    dt timestamp with time zone DEFAULT now()
);
    DROP TABLE public.device;
       public         heap    postgres    false            �            1259    19941    device_id_seq    SEQUENCE     �   ALTER TABLE public.device ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.device_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    203                       0    19943    device 
   TABLE DATA           D   COPY public.device (id, device_platform, device_id, dt) FROM stdin;
    public          postgres    false    203   r                  0    0    device_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.device_id_seq', 1, false);
          public          postgres    false    202                   x������ � �     