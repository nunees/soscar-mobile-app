import { Button } from '@components/Button';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { VStack, Text, Heading, Center, ScrollView } from 'native-base';

export function TermsOfUsage() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  return (
    <VStack px={5}>
      <ScrollView
        style={{
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 200,
        }}
      >
        <VStack p={5} background="white" borderRadius={10}>
          <Center>
            <Heading size="lg" mb={5}>
              TERMOS DE USO
            </Heading>
          </Center>

          <Text pb={1} textAlign="justify">
            Esta política de Termos de Uso é válida a partir de Aug 2023. TERMOS
            DE USO — Help Car
          </Text>

          <Text pb={1} textAlign="justify">
            Help Car, pessoa jurídica de direito privado descreve, através deste
            documento, as regras de uso do site https://www.helpcar.com.br e
            qualquer outro site, loja ou aplicativo operado pelo proprietário.
          </Text>

          <Text pb={1} textAlign="justify">
            Ao navegar neste website, consideramos que você está de acordo com
            os Termos de Uso abaixo.
          </Text>

          <Text pb={1} textAlign="justify">
            Caso você não esteja de acordo com as condições deste contrato,
            pedimos que não faça mais uso deste website, muito menos cadastre-se
            ou envie os seus dados pessoais.
          </Text>

          <Text pb={1} textAlign="justify">
            Se modificarmos nossos Termos de Uso, publicaremos o novo texto
            neste website, com a data de revisão atualizada. Podemos alterar
            este documento a qualquer momento. Caso haja alteração significativa
            nos termos deste contrato, podemos informá-lo por meio das
            informações de contato que tivermos em nosso banco de dados ou por
            meio de notificações.
          </Text>

          <Text pb={1} textAlign="justify">
            A utilização deste website após as alterações significa que você
            aceitou os Termos de Uso revisados. Caso, após a leitura da versão
            revisada, você não esteja de acordo com seus termos, favor encerrar
            o seu acesso.
          </Text>

          <Text bold pb={1} textAlign="justify">
            Seção 1 - Usuário
          </Text>
          <Text pb={1} textAlign="justify">
            {' '}
            A utilização deste website atribui de forma automática a condição de
            Usuário e implica a plena aceitação de todas as diretrizes e
            condições incluídas nestes Termos.
          </Text>

          <Text bold pb={1} textAlign="justify">
            Seção 2 - Adesão em conjunto com a Política de Privacidade
          </Text>
          <Text pb={1} textAlign="justify">
            {' '}
            A utilização deste website acarreta a adesão aos presentes Termos de
            Uso e a versão mais atualizada da Política de Privacidade de Help
            Car.
          </Text>

          <Text bold pb={1} textAlign="justify">
            {' '}
            Seção 3 - Condições de acesso
          </Text>
          <Text pb={1} textAlign="justify">
            {' '}
            Em geral, o acesso ao website da Help Car possui caráter gratuito e
            não exige prévia inscrição ou registro. Contudo, para usufruir de
            algumas funcionalidades, o usuário poderá precisar efetuar um
            cadastro, criando uma conta de usuário com login e senha próprios
            para acesso. É de total responsabilidade do usuário fornecer apenas
            informações corretas, autênticas, válidas, completas e atualizadas,
            bem como não divulgar o seu login e senha para terceiros.
          </Text>
          <Text pb={1} textAlign="justify">
            Partes deste website oferecem ao usuário a opção de publicar
            comentários em determinadas áreas. Help Car não consente com a
            publicação de conteúdos que tenham natureza discriminatória,
            ofensiva ou ilícita, ou ainda infrinjam direitos de autor ou
            quaisquer outros direitos de terceiros.
          </Text>
          <Text pb={1} textAlign="justify">
            A publicação de quaisquer conteúdos pelo usuário deste website,
            incluindo mensagens e comentários, implica em licença não-exclusiva,
            irrevogável e irretratável, para sua utilização, reprodução e
            publicação pela Help Car no seu website, plataformas e aplicações de
            internet, ou ainda em outras plataformas, sem qualquer restrição ou
            limitação.
          </Text>

          <Text bold pb={1} textAlign="justify">
            {' '}
            Seção 4 - Cookies
          </Text>
          <Text pb={1} textAlign="justify">
            {' '}
            Informações sobre o seu uso neste website podem ser coletadas a
            partir de cookies. Cookies são informações armazenadas diretamente
            no computador que você está utilizando. Os cookies permitem a coleta
            de informações tais como o tipo de navegador, o tempo despendido no
            website, as páginas visitadas, as preferências de idioma, e outros
            dados de tráfego anônimos. Nós e nossos prestadores de serviços
            utilizamos informações para proteção de segurança, para facilitar a
            navegação, exibir informações de modo mais eficiente, e personalizar
            sua experiência ao utilizar este website, assim como para
            rastreamento online. Também coletamos informações estatísticas sobre
            o uso do website para aprimoramento contínuo do nosso design e
            funcionalidade, para entender como o website é utilizado e para
            auxiliá-lo a solucionar questões relevantes.
          </Text>
          <Text pb={1} textAlign="justify">
            Caso não deseje que suas informações sejam coletadas por meio de
            cookies, há um procedimento simples na maior parte dos navegadores
            que permite que os cookies sejam automaticamente rejeitados, ou
            oferece a opção de aceitar ou rejeitar a transferência de um cookie
            (ou cookies) específico(s) de um site determinado para o seu
            computador. Entretanto, isso pode gerar inconvenientes no uso do
            website.
          </Text>
          <Text pb={1} textAlign="justify">
            As definições que escolher podem afetar a sua experiência de
            navegação e o funcionamento que exige a utilização de cookies. Neste
            sentido, rejeitamos qualquer responsabilidade pelas consequências
            resultantes do funcionamento limitado deste website provocado pela
            desativação de cookies no seu dispositivo (incapacidade de definir
            ou ler um cookie).
          </Text>

          <Text bold pb={1} textAlign="justify">
            {' '}
            Seção 5 - Propriedade Intelectual
          </Text>
          <Text pb={1} textAlign="justify">
            {' '}
            Todos os elementos de Help Car são de propriedade intelectual da
            mesma ou de seus licenciados. Estes Termos ou a utilização do
            website não concede a você qualquer licença ou direito de uso dos
            direitos de propriedade intelectual da Help Car ou de terceiros.
          </Text>

          <Text bold pb={1} textAlign="justify">
            Seção 6 - Links para sites de terceiros
          </Text>
          <Text pb={1} textAlign="justify">
            Este website poderá, de tempos a tempos, conter links de hipertexto
            que redirecionará você para sites das redes dos nossos parceiros,
            anunciantes, fornecedores etc. Se você clicar em um desses links
            para qualquer um desses sites, lembre-se que cada site possui as
            suas próprias práticas de privacidade e que não somos responsáveis
            por essas políticas. Consulte as referidas políticas antes de enviar
            quaisquer Dados Pessoais para esses sites.
          </Text>
          <Text pb={1} textAlign="justify">
            Não nos responsabilizamos pelas políticas e práticas de coleta, uso
            e divulgação (incluindo práticas de proteção de dados) de outras
            organizações, tais como Facebook, Apple, Google, Microsoft, ou de
            qualquer outro desenvolvedor de software ou provedor de aplicativo,
            loja de mídia social, sistema operacional, prestador de serviços de
            internet sem fio ou fabricante de dispositivos, incluindo todos os
            Dados Pessoais que divulgar para outras organizações por meio dos
            aplicativos, relacionadas a tais aplicativos, ou publicadas em
            nossas páginas em mídias sociais. Nós recomendamos que você se
            informe sobre a política de privacidade e termos de uso de cada site
            visitado ou de cada prestador de serviço utilizado.
          </Text>
          <Text bold pb={1} textAlign="justify">
            Seção 7 - Prazos e alterações
          </Text>
          <Text pb={1} textAlign="justify">
            O funcionamento deste website se dá por prazo indeterminado.
          </Text>
          <Text pb={1} textAlign="justify">
            O website no todo ou em cada uma das suas seções, pode ser
            encerrado, suspenso ou interrompido unilateralmente por Help Car, a
            qualquer momento e sem necessidade de prévio aviso.
          </Text>

          <Text bold pb={1} textAlign="justify">
            Seção 8 - Dados pessoais
          </Text>
          <Text pb={1} textAlign="justify">
            Durante a utilização deste website, certos dados pessoais serão
            coletados e tratados por Help Car e/ou pelos Parceiros. As regras
            relacionadas ao tratamento de dados pessoais de Help Car estão
            estipuladas na Política de Privacidade.
          </Text>

          <Text bold pb={1} textAlign="justify">
            Seção 9 - Contato
          </Text>
          <Text pb={1} textAlign="justify">
            Caso você tenha qualquer dúvida sobre os Termos de Uso, por favor,
            entre em contato pelo e-mail contato@helpcar.com.br.
          </Text>
        </VStack>
        <Button
          mt={10}
          title="Voltar"
          variant="outline"
          onPress={() => navigation.navigate('SignUp')}
        />
      </ScrollView>
    </VStack>
  );
}
