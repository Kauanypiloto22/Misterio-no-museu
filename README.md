# O Roubo no Museu

Protótipo React + TypeScript para o Projeto Integrador de Geometria Espacial + Desenvolvimento de Sistemas.

## Páginas
- `/` — Login
- `/caso` — narrativa e painel do caso
- `/desafios` — 5 desafios de geometria/evidências
- `/evidencias` — central de evidências
- `/anotacoes` — caderno do investigador
- `/conclusao` — suspeito + justificativa final
- `/professor` — painel de acompanhamento

## Supabase
1. Crie um projeto Supabase.
2. Copie `.env.example` para `.env.local` e preencha as variáveis.
3. Execute `supabase/schema.sql` no SQL Editor.
4. Habilite as tabelas na Data API conforme as configurações do seu projeto e mantenha RLS ativo.
5. Crie usuários pelo Supabase Auth.

O login já usa `supabase.auth.signInWithPassword` quando as variáveis estão configuradas. Sem configuração, o protótipo entra em modo demonstrativo para permitir a apresentação visual.
