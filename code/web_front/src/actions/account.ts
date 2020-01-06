import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import keyring, { Keyring } from '@polkadot/ui-keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { Dispatch } from 'redux';

export const SELECT_ACCOUNT = 'SELECT_ACCOUNT' as const;
export const selectAccount = (account : KeyringPair) => ({
  type: SELECT_ACCOUNT,
  payload: account,
})

export const REQUEST_ACCOUNTS = 'REQUEST_ACCOUNTS' as const;
const requestAccounts = () => ({
  type: REQUEST_ACCOUNTS,
})

export const RECEIVE_ACCOUNTS = 'RECEIVE_ACCOUNTS' as const;
const receiveAccounts = (accounts : KeyringPair[]) => ({
  type: RECEIVE_ACCOUNTS,
  payload: accounts,
})

const loadAccounts = (injectedAccounts : KeyringPair[]) => {
  keyring.loadAll({
    isDevelopment: true
  }, injectedAccounts);
  return keyring.getPairs();
};

export const getAccounts = () => {
  return (dispatch: Dispatch<Actions>, getState: any) => {
    dispatch(requestAccounts());
    web3Enable('ink-playground')
    .then((extensions) => {
      web3Accounts()
      .then((accounts) => {
        return accounts.map(({ address, meta }) => ({
          address,
          meta: {...meta,name: `${meta.name} (${meta.source})`}
        }));
      })
      .then((injectedAccounts) => {
        dispatch(receiveAccounts(loadAccounts(injectedAccounts as any)));
      }).catch(console.error);
    }).catch(console.error);
  }
}

export type Actions = ReturnType<typeof selectAccount | typeof requestAccounts | typeof receiveAccounts>
