import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  required,
} from 'react-admin';
import { AdminHelpBanner } from './AdminHelpBanner';

// ─── CONFIGURAÇÕES DE FOOTER ─────────────────────────────────────────────────
export const ConfigFooterEdit = () => (
  <Edit title="Configurações do Footer" id="singleton">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description="Altera as informações institucionais, Links de Redes Sociais e Selos de Certificação (NOC/Cloud) no Rodapé (Footer) global do site."
      />
      <TextInput source="nomeLegal" label="Razão Social / Nome Legal" validate={required()} fullWidth />
      <TextInput source="descricaoEmpresa" label="Descrição da Empresa no Rodapé" multiline fullWidth />
      <TextInput source="badgeNoc" label="Texto do Selo NOC 24/7" fullWidth />
      <TextInput source="badgeCloud" label="Texto do Selo Cloud Integrada" fullWidth />
      
      <TextInput source="urlLinkedin" label="Link do LinkedIn" fullWidth />
      <TextInput source="urlInstagram" label="Link do Instagram" fullWidth />
      <TextInput source="urlFacebook" label="Link do Facebook" fullWidth />
    </SimpleForm>
  </Edit>
);

// ─── CONFIGURAÇÕES DO BLOG ───────────────────────────────────────────────────
export const ConfigBlogEdit = () => (
  <Edit title="Configurações do Blog" id="singleton">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description={<>Altera os títulos institucionais, cabeçalhos e links sociais exibidos na página do <strong>Blog (<code>/blog</code>)</strong>.</>}
      />
      <TextInput source="artigosEyebrow" label="Blog - Eyebrow dos Artigos" fullWidth />
      <TextInput source="artigosHeadline" label="Blog - Headline dos Artigos" fullWidth />
      
      <TextInput source="socialEyebrow" label="Redes Sociais - Eyebrow" fullWidth />
      <TextInput source="socialHeadline" label="Redes Sociais - Headline" fullWidth />
      <TextInput source="socialDescricao" label="Redes Sociais - Descrição" multiline fullWidth />
      
      <TextInput source="urlInstagram" label="Link Oficial do Instagram" fullWidth />
      <TextInput source="urlLinkedin" label="Link Oficial do LinkedIn" fullWidth />
    </SimpleForm>
  </Edit>
);

// ─── INFORMAÇÕES DE CONTATO ──────────────────────────────────────────────────
export const ContatoInfoEdit = () => (
  <Edit title="Informações de Contato da Home" id="singleton">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera na Home?"
        description="Gerencie 100% dos textos do bloco de Contato da Home: o lado esquerdo (título, e-mail, telefone, endereço, horário) e o card flutuante do lado direito (título, descrição, lista de benefícios e botão de ação)."
      />

      <h3 style={{ marginTop: 24, marginBottom: 8, color: '#4f46e5', fontWeight: 600 }}>
        📌 Bloco Esquerdo — Informações Principais de Contato
      </h3>
      <TextInput source="eyebrow" label="Eyebrow (Ex: CONTATO)" helperText="Texto pequeno no topo" fullWidth />
      <TextInput source="headline" label="Título Principal (Headline)" placeholder="Pronto para evoluir a TI da sua empresa?" fullWidth />
      <TextInput source="headlineDestaque" label="Texto em Destaque no Título (Azul/Roxo)" placeholder="TI da sua empresa" helperText="Trecho dentro do Título Principal que receberá a cor azul/roxa de destaque" fullWidth />
      <TextInput source="subtitulo" label="Subtítulo / Descrição" placeholder="Conecte-se com nossos consultores seniores..." multiline rows={3} fullWidth />

      <TextInput source="email" label="E-mail de Contato" placeholder="contato@infodive.com.br" validate={required()} fullWidth />
      <TextInput source="telefone" label="Telefone Comercial" placeholder="+55 (51) 3330-0444" fullWidth />
      <TextInput source="endereco" label="Endereço Físico Completo" placeholder="Av. Cristóvão Colombo, 3000 - Sala 704 | Floresta, Porto Alegre - RS" multiline fullWidth />

      <TextInput source="horarioComercial" label="Horário de Atendimento Comercial" placeholder="Seg a Sex, 9h às 18h" fullWidth />
      <TextInput source="horarioNoc" label="Horário de Atendimento NOC / Suporte Crítico" placeholder="Suporte Crítico NOC: 24/7" fullWidth />

      <h3 style={{ marginTop: 32, marginBottom: 8, color: '#06b6d4', fontWeight: 600 }}>
        💬 Bloco Direito — Card Flutuante de Ajuda Imediata
      </h3>
      <TextInput source="cardTitulo" label="Título do Card" placeholder="Precisa de ajuda imediata?" fullWidth />
      <TextInput source="cardDescricao" label="Descrição do Card" placeholder="Fale com nossos engenheiros e receba uma análise rápida..." multiline rows={2} fullWidth />
      <TextInput source="cardCtaTexto" label="Texto do Botão (CTA)" placeholder="Falar com Especialista" fullWidth />
      <TextInput source="cardStatus" label="Indicador de Status (Rodapé do Card)" placeholder="Especialistas online no momento" fullWidth />

      <ArrayInput source="cardBullets" label="Lista de Benefícios / Ticks do Card">
        <SimpleFormIterator>
          <TextInput source="text" label="Benefício / Vantagem" fullWidth />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);
