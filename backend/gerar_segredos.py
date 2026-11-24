
import secrets
from getpass import getpass
from pwdlib import PasswordHash

print("CONFIGURAÇÃO DO ADMINISTRADOR")

senha = getpass("Digite uma senha administrativa: ")
confirmacao = getpass("Digite novamente a mesma senha: ")

if senha != confirmacao:
    print("As senhas não coincidem. Execute novamente.")
    raise SystemExit

if len(senha) < 12:
    print("Use uma senha com pelo menos 12 caracteres.")
    raise SystemExit

hash_senha = PasswordHash.recommended().hash(senha)
chave_secreta = secrets.token_urlsafe(48)

print("\nCopie os dois valores abaixo para o arquivo .env:")
print("\nADMIN_PASSWORD_HASH=" + hash_senha)
print("\nSECRET_KEY=" + chave_secreta)
print("\nNão compartilhe esses valores.")
