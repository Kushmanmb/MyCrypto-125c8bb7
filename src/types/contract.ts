import { TAddress } from './address';
import { NetworkId } from './networkId';
import { TUuid } from './uuid';

export interface Contract {
  name: string;
  label?: string; // Optional: UI-only field, typically set to match 'name' when passed to select components
  networkId: NetworkId;
  address: TAddress;
  abi: string;
  isCustom?: boolean;
}

export interface ExtendedContract extends Contract {
  uuid: TUuid;
}
