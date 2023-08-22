// @generated by protoc-gen-es v1.3.0
// @generated from file fook.proto (package Restaurant, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3 } from "@bufbuild/protobuf";

/**
 * @generated from enum Restaurant.Cleanliness
 */
export const Cleanliness = proto3.makeEnum(
  "Restaurant.Cleanliness",
  [
    {no: 0, name: "CLEANLINESS_UNSPECIFIED", localName: "UNSPECIFIED"},
    {no: 1, name: "CLEANLINESS_DISGUSTING", localName: "DISGUSTING"},
    {no: 2, name: "CLEANLINESS_BAD", localName: "BAD"},
    {no: 3, name: "CLEANLINESS_GOOD", localName: "GOOD"},
    {no: 4, name: "CLEANLINESS_EXCELLENT", localName: "EXCELLENT"},
  ],
);

/**
 * @generated from message Restaurant.Restaurant
 */
export const Restaurant = proto3.makeMessageType(
  "Restaurant.Restaurant",
  () => [
    { no: 1, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "price", kind: "scalar", T: 2 /* ScalarType.FLOAT */ },
    { no: 3, name: "cleanliness", kind: "enum", T: proto3.getEnumType(Cleanliness) },
    { no: 4, name: "tags", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 5, name: "take_away", kind: "message", T: TakeAwayOptions },
  ],
);

/**
 * @generated from message Restaurant.TakeAwayOptions
 */
export const TakeAwayOptions = proto3.makeMessageType(
  "Restaurant.TakeAwayOptions",
  () => [
    { no: 1, name: "pickup", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 2, name: "phone", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 3, name: "uber", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 4, name: "door_dash", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ],
);
