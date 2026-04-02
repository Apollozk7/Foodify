## 2024-05-24 - Visibility of System Status

**Learning:** When a file is being compressed or processed in the background before a form can be submitted, users might feel stuck or confused if the primary action (like sending a message) is simply disabled without clear context. A small spinner on a secondary button (like the attachment icon) is often not enough feedback.
**Action:** Always provide explicit, prominent feedback during async preparation steps. For chat inputs, update the main text input placeholder to indicate the background task (e.g., "Otimizando imagem...") and disable the input to prevent confusion.
