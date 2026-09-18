import { useState } from 'react'
import { CONFIRM_AMOUNT_DEL, CONFIRM_EXPLORER, CONFIRM_WALLET } from '../lib/confirm'

export function ConfirmPaymentBox() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONFIRM_WALLET)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="confirm-box">
      <div className="section-kicker" style={{ marginBottom: '0.35rem' }}>
        Куда переводить
      </div>
      <h3 style={{ marginBottom: '0.65rem', fontSize: '1.25rem' }}>
        Адрес системы для подтверждения
      </h3>
      <p className="section-sub" style={{ marginBottom: '1rem' }}>
        Владелец и каждый помощник отправляют с <strong>своего</strong> кошелька ровно{' '}
        <strong>{CONFIRM_AMOUNT_DEL} DEL</strong> на этот адрес. Потом вставляют номер
        (hash) своей транзакции ниже.
      </p>

      <div className="confirm-amount">
        <span>Сумма перевода</span>
        <strong>
          {CONFIRM_AMOUNT_DEL} DEL
        </strong>
      </div>

      <div className="confirm-address">
        <code>{CONFIRM_WALLET}</code>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => void copy()}>
          {copied ? 'Скопировано' : 'Скопировать адрес'}
        </button>
      </div>

      <p className="section-sub" style={{ marginTop: '0.85rem', fontSize: '0.88rem' }}>
        Перевод должен идти <strong>на этот адрес</strong>, а не друг другу. Проверить
        адрес в сети:{' '}
        <a
          className="token-link"
          href={`${CONFIRM_EXPLORER}/address/${CONFIRM_WALLET}`}
          target="_blank"
          rel="noreferrer"
        >
          открыть в обозревателе →
        </a>
      </p>
    </div>
  )
}
