# Como compilar o projeto

Requísitos de software:

- Java JDK 8 ou 11
- EAS Expo Build
- Android SDK

Requisitos de Hardware:

- Pelo menos 4 cores de processamento disponíveis
- Pelo menos 8Gb de memória instalada
- Conexão com a internet

## Instalação de dependencias para compilação

```
sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get install build-essential cmake ninja-build
```

## Instalação do Java Jdk (Linux)

```
sudo apt-get install openjdk-11-jdk openjdk-11-jre
```

## Instalação EAS Build

O módulo [EAS](https://docs.expo.dev/build/setup/) serve para transformar o código javascript em Java e logo em seguida
compilar as classes

```
npm install -g eas-cli
```

Faça o login utilizando sua conta Expo

```
eas login
```

Use o comando abaixo para compilar, caso queira utilizar os servidores da expo retire o argumento `--local`.

- `--local` - Build local na máquina (não é possível compilar para mais de uma plataforma)
- `--profile` - Define o profile com base no arquivo `eas.json`
- `--plataform` - Para qual plataforma deseja compilar

```
╰─ eas build --local --profile production --platform android
```

## Instalação no dispositivo

Baixe o apk [aqui]("./com.felipe.sosauto.apk") e instale no seu dispositivo


## Outros
Videos de demonstração do aplicativo e o slide utilizado para apresentação estão disponíveis na pasta `docs/`

Made with ❤️ by nunees

