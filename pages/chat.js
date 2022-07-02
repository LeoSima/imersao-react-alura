import React from 'react';
import { Component } from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { IoSend } from "react-icons/io5";
import { BsImageFill } from "react-icons/bs";
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import { Box, Text, TextField, Image, Button } from '@skynexui/components';
// import { ButtonSendFile } from '../src/components/ButtonSendFile';

const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyOTU4NiwiZXhwIjoxOTU4OTA1NTg2fQ.IsbcLHQzzTJeAk16jpz8yM5p7AWP6NE_souqEnNK0is';
const SUPABASE_URL = 'https://ukocdzvxerptpupwlrqa.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem){
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive) => {
            adicionaMensagem(respostaLive.new);
        })
        .subscribe();
}

export default function ChatPage() {
    // Sua lógica vai aqui
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

    // ./Sua lógica vai aqui

    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', {ascending: false})
            .then(({ data }) => {
                setListaDeMensagens(data);
            });
            const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
                setListaDeMensagens((valorAtualDaLista) => {
                    return [
                        novaMensagem,
                        ...valorAtualDaLista
                    ]
                });
            });

            return () => {
                subscription.unsubscribe();
            }
    }, []);

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            de: usuarioLogado,
            texto: novaMensagem
        };

        supabaseClient
            .from('mensagens')
            .insert([
                mensagem
            ])
            .then(({ data }) => {

            });

        setMensagem('');
    }
    
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaDeMensagens} />
                    {/* {listaDeMensagens.map((mensagemAtual) => {
                        return(
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />

                        <ButtonSendSticker 
                            onStickerClick={(sticker) => {
                                handleNovaMensagem(`:sticker:${sticker}`);
                            }}
                        />

                        <ButtonSendFile />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log('MessageList', props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >

            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto.startsWith(':sticker:') 
                        ? (
                            <Image src={mensagem.texto.replace(':sticker:', '')}/>
                        )
                        : mensagem.texto.startsWith(':image:')
                            ? (
                                <Image src={mensagem.texto.replace(':image:', '')}/>
                            )
                            : (
                                mensagem.texto
                            )}
                    </Text>
                )
            })}
        </Box>
    )
}

function ButtonSendFile () {
    const[isOpen, setOpenState] = React.useState('');
    const[file, setFile] = React.useState(null);
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;

    async function fileUploadHandler() {
        if (file != null) {
            const {data, error} = await supabaseClient.storage.from('images').upload(`public/${file.name}`,
            file, {
                cacheControl: 3600,
                upsert: false
            });
            const { link, erro } = supabaseClient.storage.from(`images`).getPublicUrl(`public/${file.name}`);
            console.log(link);
            handleNovaMensagem(`:image:${link}`);
        }
    }

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            de: usuarioLogado,
            texto: novaMensagem
        };

        supabaseClient
            .from('mensagens')
            .insert([
                mensagem
            ])
            .then(({ data }) => {

            });
    }

    return (
        <Box
          styleSheet={{
            position: 'relative',
            margin: '2px',
          }}
        >
            <Button
                styleSheet={{
                    borderRadius: '50%',
                    padding: '0 3px 0 0',
                    minWidth: '50px',
                    minHeight: '50px',
                    fontSize: '20px',
                    marginBottom: '8px',
                    lineHeight: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: appConfig.theme.colors.neutrals[550],
                    filter: 'grayscale(1)',
                    hover: {
                        filter: 'grayscale(1)',
                    }
                }}
                label = {<BsImageFill/>}
                onClick={() => setOpenState(!isOpen)}
            />
            {isOpen && (
                <Box
                    styleSheet={{
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '5px',
                        position: 'absolute',
                        backgroundColor: appConfig.theme.colors.neutrals[750],
                        width: {
                            xs: '200px',
                            sm: '290px',
                        },
                        height: '150px',
                        right: '30px',
                        bottom: '50px',
                        padding: '16px',
                        boxShadow: 'rgba(4, 4, 5, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 8px 16px 0px',
                    }}
                >
                    <Text
                        styleSheet={{
                            color: appConfig.theme.colors.neutrals["000"],
                            fontWeight: 'bold',
                        }}
                    >
                        Upload
                    </Text>
    
                    {/* <InputSendFile />  */}

                    <Box
                        styleSheet={{
                            position: 'relative',
                            margin: '2px',
                        }}
                    >
                        <input type="file" onChange={(event) => {
                            const selectedFile = event.target.files[0];
                            setFile(selectedFile);
                        }} />
                        <Button
                            styleSheet={{
                                borderRadius: '50%',
                                padding: '0 3px 0 0',
                                minWidth: '50px',
                                minHeight: '50px',
                                fontSize: '20px',
                                marginBottom: '8px',
                                lineHeight: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                left: '80%',
                                backgroundColor: appConfig.theme.colors.neutrals[550],
                                filter: 'grayscale(1)',
                                hover: {
                                    filter: 'grayscale(1)',
                                }
                            }}
                            label = {<IoSend/>}
                            onClick = {fileUploadHandler}
                        >
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    )

}

class InputSendFile extends Component {

    state = {
        selectedFile: null
    }

    fileSelectedHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
        // console.log(this.state.selectedFile);
    }

    fileUploadHandler = async() => {
        var imagem = this.state.selectedFile;
        // console.log(imagem);
        const { data, error } = await supabaseClient.storage.from('images').upload(`public/${imagem.name}`, imagem, {
            cacheControl: 3600,
            upsert: false
        });
    }

    render() {
        return(
            <Box
                styleSheet={{
                position: 'relative',
                margin: '2px',
                }}
            >
                <input type="file" onChange={this.fileSelectedHandler} />
                <Button
                    styleSheet={{
                        borderRadius: '50%',
                        padding: '0 3px 0 0',
                        minWidth: '50px',
                        minHeight: '50px',
                        fontSize: '20px',
                        marginBottom: '8px',
                        lineHeight: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        left: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[550],
                        filter: 'grayscale(1)',
                        hover: {
                            filter: 'grayscale(1)',
                        }
                    }}
                    label = {<IoSend/>}
                    onClick = {this.fileUploadHandler}
                >
                </Button>
            </Box>
        )
    }

}
