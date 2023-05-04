import React from "react";
import { Pagination } from "antd";
import "./pagination.css";
export default class PaginationElement extends React.Component {
  render() {
    const { totalItems, currentPage, onGetItemIndex } = this.props;
    return (
      <Pagination
        margin={100}
        className="pagination"
        current={currentPage}
        defaultPageSize={6}
        total={totalItems}
        onChange={(e) => {
          onGetItemIndex(e);
        }}
      />
    );
  }
}
