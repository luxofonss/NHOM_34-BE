"use strict";

let productAttribute = new Map();

const attributeList = [
  {
    name: "phoneModel",
    detail: {
      name: { vi: "Model điện thoại" },
      type: "text",
    },
  },
  {
    name: "storeCapacity",
    detail: {
      name: { vi: "Dung lượng lưu trữ" },
      type: "number",
      unit: "GB",
    },
  },
  {
    name: "primaryCameraResolution",
    detail: {
      name: { vi: "Độ phân giải camera chính" },
      type: "number",
      unit: "MP",
    },
  },
  {
    name: "numberOfPrimaryCamera",
    detail: {
      name: { vi: "Số camera" },
      type: "number",
      unit: "MP",
    },
  },
  {
    name: "warrantyType",
    detail: {
      name: { vi: "Loại bảo hành" },
      type: "select",
      selections: [
        "Bảo hành nhà cung cấp",
        "Bảo hành nhà sản xuất",
        "Bảo hành quốc tế",
        "Không bảo hành",
      ],
    },
  },
  {
    name: "warrantyDuration",
    detail: {
      name: { vi: "Thời hạn bảo hành" },
      type: "number",
      unit: "Tháng",
    },
  },
  {
    name: "ram",
    detail: {
      name: { vi: "RAM" },
      type: "number",
      unit: "GB",
    },
  },
  {
    name: "rom",
    detail: {
      name: { vi: "ROM" },
      type: "number",
      unit: "GB",
    },
  },
  {
    name: "supportOperatingSystem",
    detail: {
      name: { vi: "Hỗ trợ hệ điều hành" },
      type: "text",
    },
  },
  {
    name: "numberOfSIMCardSlot",
    detail: {
      name: { vi: "Số khe cắm sim" },
      type: "number",
    },
  },
  {
    name: "SIMType",
    detail: {
      name: { vi: "Loại sim" },
      type: "number",
    },
  },
  {
    name: "caseType",
    detail: {
      name: { vi: "Loại ốp" },
      type: "text",
    },
  },
  {
    name: "screenSize",
    detail: {
      name: { vi: "Kích thước màn hình" },
      type: "number",
      unit: "inches",
    },
  },
  {
    name: "processorType",
    detail: {
      name: { vi: "Bộ xử lý" },
      type: "text",
    },
  },
  {
    name: "mobilePhoneFeatures",
    detail: {
      name: { vi: "Tính năng" },
      type: "text",
    },
  },
  {
    name: "cellular",
    detail: {
      name: { vi: "Điện thoại di động" },
      type: "text",
    },
  },
  {
    name: "mobileCableTypes",
    detail: {
      name: { vi: "Loại cáp điện thoại" },
      type: "text",
    },
  },
  {
    name: "screenProtectorType",
    detail: {
      name: { vi: "Loại miếng dán bảo vệ màn hình" },
      type: "text",
    },
  },
  {
    name: "batteryCapacity.value",
    detail: {
      name: { vi: "Dung lượng pin" },
      type: "number",
    },
  },
  {
    name: "batteryCapacity.unit",
    detail: {
      name: { vi: "Đơn vị pin" },
      type: "select",
      selections: ["mAh", "cell", "Wh"],
    },
  },
  {
    name: "dimensions.L",
    detail: {
      name: { vi: "Chiều dài" },
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "number",
      unit: "mm",
    },
  },
];

attributeList.forEach((attribute) => {
  productAttribute.set(attribute.name, {
    ...attribute.detail,
    path: attribute.name,
  });
});

module.exports = {
  productAttribute,
};
