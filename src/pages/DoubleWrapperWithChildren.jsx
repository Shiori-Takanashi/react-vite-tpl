// src/pages/DoubleWrapperWithChildren.jsx
import data from "../data/doubleWrapperWithChildren.json";
import PageLayout from "../layouts/PageLayout";
import "../styles/doubleWrapper.css";

export default function DoubleWrapperWithChildren() {
  return <PageLayout title={data.title}></PageLayout>;
}
