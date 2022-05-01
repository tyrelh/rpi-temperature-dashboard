import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from "antd";

export default function Loading() {
  return (
    <div className="loadingContainer">
      <Spin size="large"/>
      {/* <div className="loading">
        <LoadingOutlined />
      </div> */}
    </div>
  )
}