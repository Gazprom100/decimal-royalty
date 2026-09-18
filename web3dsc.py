import time
import logging
from web3 import Web3
from utils import get_dsc_key, redis

w3 = Web3(Web3.HTTPProvider("https://node.decimalchain.com/web3/"))

async def balance(address):
	...

def get_address(private_key):
	PA = w3.eth.account.from_key(private_key)
	return PA.address

def address_format(address):
	return Web3.to_checksum_address(address)

def generate_dsc_address(index = 0, index2 = 0):
	private_key = get_dsc_key(f"m/44'/60'/0'/{index2}/{index}")
	address = get_address(private_key).lower()
	return address, private_key

async def send_del(to_address, amount, pay_index = None):
	if pay_index is None:
		from_address, private_key = generate_dsc_address()
	else:
		from_address, private_key = generate_dsc_address(pay_index, 1)

	from_address = address_format(from_address)
	to_address = address_format(to_address)

	nonce_key = f"WEB3_DSC_NONCE_{from_address}"

	nonce = await redis.get(nonce_key)

	nonce = w3.eth.get_transaction_count(from_address) if not nonce else int(nonce) + 1

	await redis.set(nonce_key, nonce, 30)

	transaction = {
		'from': from_address,
		'to': to_address,
		'value': w3.to_wei(amount, 'ether'),
		'gas': 21000,
		'gasPrice': w3.to_wei(50000, 'gwei'),
		'nonce': nonce,
		'chainId': 75
	}

	try:
		signed_txn = w3.eth.account.sign_transaction(transaction, private_key)

		tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)

		return f"https://explorer.decimalchain.com/transactions/{w3.to_hex(tx_hash)}"
	except Exception as e:
		logging.error(f"send_del failed to_address {to_address}, amount {amount}, error {str(e)}")
