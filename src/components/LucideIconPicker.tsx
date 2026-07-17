'use client';

import React, { useState, useMemo, createElement } from 'react';
import { useInput, InputProps } from 'react-admin';
import { Autocomplete, TextField, Box, Typography, Chip } from '@mui/material';
import * as LucideIcons from 'lucide-react';

// ─── Curated list of icons relevant for IT/Tech/Services ─────────────────────
// These are the most useful Lucide icons for an IT solutions company.
// Grouped by category for easier browsing.
const ICON_LIST: { name: string; label: string; tags: string[] }[] = [
  // Infrastructure & Servers
  { name: 'server', label: 'Server', tags: ['servidor', 'infraestrutura', 'hardware'] },
  { name: 'hard-drive', label: 'Hard Drive', tags: ['disco', 'armazenamento', 'storage'] },
  { name: 'cpu', label: 'CPU', tags: ['processador', 'hardware', 'chip'] },
  { name: 'memory-stick', label: 'Memory Stick', tags: ['memória', 'ram', 'hardware'] },
  { name: 'database', label: 'Database', tags: ['banco de dados', 'dados', 'storage'] },
  { name: 'container', label: 'Container', tags: ['docker', 'container', 'virtualização'] },
  { name: 'boxes', label: 'Boxes', tags: ['pacotes', 'módulos', 'containers'] },
  { name: 'monitor', label: 'Monitor', tags: ['tela', 'display', 'computador'] },
  { name: 'laptop', label: 'Laptop', tags: ['notebook', 'computador', 'endpoint'] },
  { name: 'pc-case', label: 'PC Case', tags: ['desktop', 'computador', 'gabinete'] },
  { name: 'circuit-board', label: 'Circuit Board', tags: ['placa', 'circuito', 'hardware'] },

  // Network & Cloud
  { name: 'cloud', label: 'Cloud', tags: ['nuvem', 'cloud', 'saas'] },
  { name: 'cloud-cog', label: 'Cloud Cog', tags: ['nuvem', 'configuração', 'cloud'] },
  { name: 'cloud-download', label: 'Cloud Download', tags: ['download', 'nuvem', 'backup'] },
  { name: 'cloud-upload', label: 'Cloud Upload', tags: ['upload', 'nuvem', 'migração'] },
  { name: 'network', label: 'Network', tags: ['rede', 'network', 'conexão'] },
  { name: 'wifi', label: 'Wi-Fi', tags: ['wireless', 'sem fio', 'rede'] },
  { name: 'globe', label: 'Globe', tags: ['internet', 'global', 'web'] },
  { name: 'router', label: 'Router', tags: ['roteador', 'rede', 'network'] },
  { name: 'cable', label: 'Cable', tags: ['cabo', 'conexão', 'rede'] },
  { name: 'satellite-dish', label: 'Satellite Dish', tags: ['antena', 'satélite', 'comunicação'] },

  // Security
  { name: 'shield', label: 'Shield', tags: ['segurança', 'proteção', 'defesa'] },
  { name: 'shield-check', label: 'Shield Check', tags: ['segurança', 'verificado', 'proteção'] },
  { name: 'shield-alert', label: 'Shield Alert', tags: ['alerta', 'segurança', 'aviso'] },
  { name: 'lock', label: 'Lock', tags: ['cadeado', 'segurança', 'bloqueio'] },
  { name: 'lock-keyhole', label: 'Lock Keyhole', tags: ['fechadura', 'segurança', 'acesso'] },
  { name: 'key', label: 'Key', tags: ['chave', 'acesso', 'autenticação'] },
  { name: 'key-round', label: 'Key Round', tags: ['chave', 'acesso', 'criptografia'] },
  { name: 'fingerprint', label: 'Fingerprint', tags: ['digital', 'biometria', 'identidade'] },
  { name: 'scan-eye', label: 'Scan Eye', tags: ['scanner', 'monitoramento', 'vigilância'] },
  { name: 'scan', label: 'Scan', tags: ['scanner', 'varredura', 'análise'] },
  { name: 'bug', label: 'Bug', tags: ['bug', 'erro', 'vulnerabilidade'] },
  { name: 'shield-off', label: 'Shield Off', tags: ['desprotegido', 'vulnerável', 'risco'] },

  // Data & Analytics
  { name: 'bar-chart-3', label: 'Bar Chart', tags: ['gráfico', 'análise', 'dados'] },
  { name: 'line-chart', label: 'Line Chart', tags: ['gráfico', 'tendência', 'monitoramento'] },
  { name: 'pie-chart', label: 'Pie Chart', tags: ['gráfico', 'distribuição', 'relatório'] },
  { name: 'trending-up', label: 'Trending Up', tags: ['tendência', 'crescimento', 'aumento'] },
  { name: 'activity', label: 'Activity', tags: ['atividade', 'monitoramento', 'pulso'] },
  { name: 'gauge', label: 'Gauge', tags: ['medidor', 'performance', 'velocidade'] },

  // AI & Intelligence
  { name: 'brain', label: 'Brain', tags: ['cérebro', 'inteligência', 'ia', 'ai'] },
  { name: 'brain-circuit', label: 'Brain Circuit', tags: ['ia', 'neural', 'machine learning'] },
  { name: 'bot', label: 'Bot', tags: ['robô', 'automação', 'chatbot'] },
  { name: 'sparkles', label: 'Sparkles', tags: ['ia', 'magia', 'inteligência'] },
  { name: 'zap', label: 'Zap', tags: ['raio', 'rápido', 'energia', 'automação'] },

  // Tools & Settings
  { name: 'settings', label: 'Settings', tags: ['configurações', 'ajustes', 'engrenagem'] },
  { name: 'settings-2', label: 'Settings 2', tags: ['configurações', 'filtros', 'ajustes'] },
  { name: 'wrench', label: 'Wrench', tags: ['chave', 'ferramenta', 'manutenção'] },
  { name: 'hammer', label: 'Hammer', tags: ['martelo', 'construção', 'ferramenta'] },
  { name: 'cog', label: 'Cog', tags: ['engrenagem', 'configuração', 'sistema'] },
  { name: 'tool', label: 'Tool', tags: ['ferramenta', 'utilitário', 'manutenção'] },
  { name: 'sliders-horizontal', label: 'Sliders', tags: ['controle', 'ajuste', 'configuração'] },

  // Communication & Support
  { name: 'headphones', label: 'Headphones', tags: ['fone', 'suporte', 'atendimento'] },
  { name: 'headset', label: 'Headset', tags: ['headset', 'suporte', 'call center'] },
  { name: 'phone', label: 'Phone', tags: ['telefone', 'contato', 'chamada'] },
  { name: 'phone-call', label: 'Phone Call', tags: ['ligação', 'contato', 'suporte'] },
  { name: 'mail', label: 'Mail', tags: ['email', 'correio', 'mensagem'] },
  { name: 'message-circle', label: 'Message Circle', tags: ['chat', 'mensagem', 'conversa'] },
  { name: 'message-square', label: 'Message Square', tags: ['chat', 'mensagem', 'suporte'] },
  { name: 'life-buoy', label: 'Life Buoy', tags: ['ajuda', 'suporte', 'resgate'] },

  // Business & People
  { name: 'users', label: 'Users', tags: ['usuários', 'equipe', 'pessoas'] },
  { name: 'user', label: 'User', tags: ['usuário', 'pessoa', 'perfil'] },
  { name: 'user-check', label: 'User Check', tags: ['usuário', 'verificado', 'aprovado'] },
  { name: 'user-cog', label: 'User Cog', tags: ['admin', 'gerente', 'configuração'] },
  { name: 'building-2', label: 'Building', tags: ['empresa', 'prédio', 'escritório'] },
  { name: 'briefcase', label: 'Briefcase', tags: ['negócio', 'trabalho', 'empresa'] },
  { name: 'handshake', label: 'Handshake', tags: ['parceria', 'acordo', 'negócio'] },
  { name: 'award', label: 'Award', tags: ['prêmio', 'certificação', 'qualidade'] },
  { name: 'trophy', label: 'Trophy', tags: ['troféu', 'conquista', 'sucesso'] },
  { name: 'target', label: 'Target', tags: ['alvo', 'objetivo', 'meta'] },

  // Files & Documents
  { name: 'file', label: 'File', tags: ['arquivo', 'documento', 'ficheiro'] },
  { name: 'file-text', label: 'File Text', tags: ['documento', 'texto', 'relatório'] },
  { name: 'file-check', label: 'File Check', tags: ['arquivo', 'verificado', 'aprovado'] },
  { name: 'folder', label: 'Folder', tags: ['pasta', 'diretório', 'organização'] },
  { name: 'folder-open', label: 'Folder Open', tags: ['pasta', 'aberta', 'explorar'] },
  { name: 'clipboard-list', label: 'Clipboard List', tags: ['lista', 'checklist', 'tarefas'] },

  // Arrows & Navigation
  { name: 'arrow-right', label: 'Arrow Right', tags: ['seta', 'direita', 'próximo'] },
  { name: 'arrow-up-right', label: 'Arrow Up Right', tags: ['seta', 'externo', 'link'] },
  { name: 'chevron-right', label: 'Chevron Right', tags: ['seta', 'próximo', 'avançar'] },
  { name: 'move', label: 'Move', tags: ['mover', 'arrastar', 'posição'] },
  { name: 'refresh-cw', label: 'Refresh', tags: ['atualizar', 'recarregar', 'sincronizar'] },
  { name: 'rotate-cw', label: 'Rotate', tags: ['girar', 'rotacionar', 'ciclo'] },

  // Status & Feedback
  { name: 'check-circle', label: 'Check Circle', tags: ['sucesso', 'ok', 'confirmado'] },
  { name: 'check', label: 'Check', tags: ['ok', 'feito', 'concluído'] },
  { name: 'x-circle', label: 'X Circle', tags: ['erro', 'falha', 'cancelar'] },
  { name: 'alert-triangle', label: 'Alert Triangle', tags: ['alerta', 'aviso', 'atenção'] },
  { name: 'info', label: 'Info', tags: ['informação', 'ajuda', 'detalhe'] },
  { name: 'bell', label: 'Bell', tags: ['notificação', 'alerta', 'sino'] },
  { name: 'clock', label: 'Clock', tags: ['relógio', 'tempo', 'horário'] },
  { name: 'timer', label: 'Timer', tags: ['cronômetro', 'tempo', 'sla'] },
  { name: 'calendar', label: 'Calendar', tags: ['calendário', 'data', 'agenda'] },

  // Misc Useful
  { name: 'star', label: 'Star', tags: ['estrela', 'favorito', 'destaque'] },
  { name: 'heart', label: 'Heart', tags: ['coração', 'favorito', 'amor'] },
  { name: 'bookmark', label: 'Bookmark', tags: ['marcador', 'salvo', 'favorito'] },
  { name: 'link', label: 'Link', tags: ['link', 'url', 'conexão'] },
  { name: 'external-link', label: 'External Link', tags: ['link', 'externo', 'abrir'] },
  { name: 'download', label: 'Download', tags: ['baixar', 'download', 'salvar'] },
  { name: 'upload', label: 'Upload', tags: ['enviar', 'upload', 'carregar'] },
  { name: 'search', label: 'Search', tags: ['busca', 'pesquisa', 'procurar'] },
  { name: 'eye', label: 'Eye', tags: ['olho', 'visualizar', 'monitorar'] },
  { name: 'layers', label: 'Layers', tags: ['camadas', 'níveis', 'stack'] },
  { name: 'package', label: 'Package', tags: ['pacote', 'produto', 'entrega'] },
  { name: 'truck', label: 'Truck', tags: ['caminhão', 'entrega', 'logística'] },
  { name: 'rocket', label: 'Rocket', tags: ['foguete', 'lançamento', 'rápido'] },
  { name: 'flame', label: 'Flame', tags: ['fogo', 'popular', 'quente'] },
  { name: 'lightbulb', label: 'Lightbulb', tags: ['ideia', 'inovação', 'lâmpada'] },
  { name: 'plug', label: 'Plug', tags: ['plug', 'conexão', 'integração'] },
  { name: 'power', label: 'Power', tags: ['energia', 'ligar', 'desligar'] },
  { name: 'battery-charging', label: 'Battery Charging', tags: ['bateria', 'energia', 'carregando'] },
  { name: 'code', label: 'Code', tags: ['código', 'programação', 'desenvolvimento'] },
  { name: 'terminal', label: 'Terminal', tags: ['terminal', 'console', 'cli'] },
  { name: 'git-branch', label: 'Git Branch', tags: ['git', 'branch', 'desenvolvimento'] },
  { name: 'webhook', label: 'Webhook', tags: ['webhook', 'api', 'integração'] },
  { name: 'blocks', label: 'Blocks', tags: ['blocos', 'módulos', 'componentes'] },
  { name: 'workflow', label: 'Workflow', tags: ['fluxo', 'processo', 'automação'] },
  { name: 'shuffle', label: 'Shuffle', tags: ['aleatório', 'misturar', 'integração'] },
  { name: 'map-pin', label: 'Map Pin', tags: ['localização', 'mapa', 'endereço'] },
  { name: 'image', label: 'Image', tags: ['imagem', 'foto', 'mídia'] },
  { name: 'video', label: 'Video', tags: ['vídeo', 'câmera', 'mídia'] },
  { name: 'play', label: 'Play', tags: ['play', 'executar', 'iniciar'] },
  { name: 'square-kanban', label: 'Kanban', tags: ['kanban', 'projeto', 'gestão'] },
];

/**
 * Converts a kebab-case icon name like "arrow-up-right" to PascalCase "ArrowUpRight"
 * to match Lucide's named exports.
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

/**
 * Tries to resolve a Lucide icon component by its kebab-case name.
 */
function getLucideIcon(name: string): React.ComponentType<{ size?: number; strokeWidth?: number }> | null {
  if (!name) return null;
  const pascalName = toPascalCase(name);
  const icon = (LucideIcons as Record<string, unknown>)[pascalName];
  if (typeof icon === 'function') {
    return icon as React.ComponentType<{ size?: number; strokeWidth?: number }>;
  }
  return null;
}

/**
 * Small component that renders a Lucide icon by kebab-case name.
 */
function IconPreview({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = getLucideIcon(name);
  if (!Icon) return <Box sx={{ width: size, height: size, bgcolor: 'action.disabled', borderRadius: '4px' }} />;
  return createElement(Icon, { size, strokeWidth: 1.75 });
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface LucideIconPickerInputProps extends Omit<InputProps, 'source'> {
  source: string;
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const LucideIconPickerInput: React.FC<LucideIconPickerInputProps> = ({
  source,
  label = 'Ícone Lucide',
  helperText,
  fullWidth = true,
  ...rest
}) => {
  const {
    field,
    fieldState: { error },
  } = useInput({ source, ...rest });

  const [inputValue, setInputValue] = useState('');

  // Filter the icon list based on search input
  const filteredIcons = useMemo(() => {
    if (!inputValue) return ICON_LIST;
    const q = inputValue.toLowerCase();
    return ICON_LIST.filter(
      (icon) =>
        icon.name.toLowerCase().includes(q) ||
        icon.label.toLowerCase().includes(q) ||
        icon.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [inputValue]);

  // Find the currently selected icon object
  const selectedIcon = ICON_LIST.find((i) => i.name === field.value) || null;

  return (
    <Autocomplete
      options={filteredIcons}
      value={selectedIcon}
      inputValue={inputValue}
      onInputChange={(_e, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(_e, newValue) => {
        field.onChange(newValue ? newValue.name : '');
      }}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      fullWidth={fullWidth}
      clearOnBlur={false}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Box
            component="li"
            key={key}
            {...otherProps}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              py: 1,
              px: 1.5,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: '8px',
                bgcolor: 'rgba(14, 102, 255, 0.08)',
                color: '#0E66FF',
                flexShrink: 0,
              }}
            >
              <IconPreview name={option.name} size={20} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                {option.label}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                {option.name}
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: '40%' }}>
              {option.tags.slice(0, 2).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.65rem', height: 20 }}
                />
              ))}
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={helperText || (error ? error.message : 'Busque por nome, categoria ou palavra-chave em português')}
          InputProps={{
            ...params.InputProps,
            startAdornment: field.value ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  bgcolor: 'rgba(14, 102, 255, 0.1)',
                  color: '#0E66FF',
                  mr: 1,
                  flexShrink: 0,
                }}
              >
                <IconPreview name={field.value} size={18} />
              </Box>
            ) : undefined,
          }}
          size="small"
        />
      )}
      noOptionsText="Nenhum ícone encontrado"
      sx={{ mb: 1 }}
    />
  );
};

export default LucideIconPickerInput;
