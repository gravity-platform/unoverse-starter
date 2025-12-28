/**
 * AccountTransferLayout Template Defaults
 */

import { createMockClients } from "../core";
import AccountTransferWidget from "../../components/AccountTransferWidget/AccountTransferWidget";
import {
  defaultTransferData,
  defaultAvailableAccounts,
  defaultBeneficiaries,
} from "../../components/AccountTransferWidget/defaults";

// Create all 3 states using shared factory
export const {
  mockHistoryInitial,
  mockHistoryStreaming,
  mockHistoryComplete,
  mockClientInitial,
  mockClientStreaming,
  mockClientComplete,
} = createMockClients([
  {
    componentType: "AccountTransferWidget",
    Component: AccountTransferWidget,
    props: {
      transferData: defaultTransferData,
      availableAccounts: defaultAvailableAccounts,
      beneficiaries: defaultBeneficiaries,
    },
  },
]);
