// @ts-nocheck
import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";
import Skeleton from "../src/components/skeleton/Skeleton";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker/ButtonSendSticker";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM5MzcyNCwiZXhwIjoxOTU4OTY5NzI0fQ.SkiAYM1EH-2vrHnvZpqAlRPoJ9UnHMnsnsgJCJB4_gU";
const SUPABASE_URL = "https://otlsyustqxxoodkqebwh.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
  return supabaseClient
    .from("mensagens")
    .on("INSERT", (resposta) => {
      adicionaMensagem(resposta.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState("");
  const [listaMensagens, setListaMensagens] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const roteamento = useRouter();
  const usuariLogado = roteamento.query.username;

  React.useEffect(() => {
    const dadosDoSupabase = supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        console.log("Dados:", data);
        setListaMensagens(data);
        setIsLoading(false);
      });

    escutaMensagensEmTempoReal((novaMensagem) => {
      setListaMensagens((valorAtual) => {
        return [novaMensagem, ...valorAtual];
      });
    });
  }, []);

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: usuariLogado,
      texto: novaMensagem,
    };

    supabaseClient
      .from("mensagens")
      .insert([mensagem])
      .then(() => {});

    setMensagem("");
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList mensagens={listaMensagens} isLoading={isLoading} />
          {/* {listaMensagens.map((mensagemAtual) => {
            return (
              <li key={mensagemAtual.id}>
                {mensagemAtual.de}: {mensagemAtual.texto}
              </li>
            );
          })} */}
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                setMensagem(event.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter" || event.key === "NumpadEnter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />

            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleNovaMensagem(":sticker: " + sticker);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList({ mensagens, isLoading }) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "hidden",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        mensagens.map((mensagemAtual) => {
          return (
            <Text
              key={mensagemAtual.id}
              tag="li"
              styleSheet={{
                borderRadius: "5px",
                padding: "6px",
                marginBottom: "12px",
                hover: {
                  backgroundColor: appConfig.theme.colors.neutrals[700],
                },
              }}
            >
              <Box
                styleSheet={{
                  marginBottom: "8px",
                }}
              >
                <Image
                  styleSheet={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                  src={`https://github.com/${mensagemAtual.de}.png`}
                />
                <Text tag="strong">{mensagemAtual.de}</Text>
                <Text
                  styleSheet={{
                    fontSize: "10px",
                    marginLeft: "8px",
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {new Date().toLocaleDateString()}
                </Text>
              </Box>
              {mensagemAtual.texto.startsWith(":sticker:") ? (
                <Image
                  src={mensagemAtual.texto.replace(":sticker:", "")}
                  styleSheet={{ maxWidth: "30%" }}
                />
              ) : (
                mensagemAtual.texto
              )}
            </Text>
          );
        })
      )}
    </Box>
  );
}
