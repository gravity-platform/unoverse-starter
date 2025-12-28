/**
 * BookingWidgetLayout Template Defaults
 */

import { createMockClients } from "../core";
import BookingWidget from "../../components/BookingWidget/BookingWidget";
import { defaultBookingData } from "../../components/BookingWidget/defaults";

// Create all 3 states using shared factory
export const {
  mockHistoryInitial,
  mockHistoryStreaming,
  mockHistoryComplete,
  mockClientInitial,
  mockClientStreaming,
  mockClientComplete,
} = createMockClients([
  { componentType: "BookingWidget", Component: BookingWidget, props: { bookingData: defaultBookingData } },
]);
