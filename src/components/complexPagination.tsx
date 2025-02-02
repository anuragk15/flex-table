import { PaginationProps } from "./table";

 export  const ComplexPagination: React.FC<PaginationProps> = ({
    pageCount,
    currentPage,
    onPageChange,
  }) => {
    const handlePageChange = (page: number) => {
      if (page >= 0 && page < pageCount) {
        onPageChange(page);
      }
    };
  
    return (
      <div style={{ display: "flex", maxWidth:'320px', justifySelf:'center', margin:'auto' , justifyContent:'space-between', gap: "12px", alignItems: "center" }}>
        {/* First Page Button */}
        <button
          onClick={() => handlePageChange(0)}
          disabled={currentPage === 0}
          style={{ padding: "8px", border: "none", cursor: "pointer" }}
        >
          First
        </button>
  
        {/* Previous Page Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          style={{ padding: "8px", border: "none", cursor: "pointer" }}
        >
          Prev
        </button>
  
        {/* Page Button */}
        <button
          onClick={() => handlePageChange(currentPage)}
          style={{
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#f0f0f0",
            cursor: "pointer",
            minWidth: "36px",
            color: "#333",
          }}
        >
          {currentPage + 1}
        </button>
  
        {/* Next Page Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount - 1}
          style={{ padding: "8px", border: "none", cursor: "pointer" }}
        >
          Next
        </button>
  
        {/* Last Page Button */}
        <button
          onClick={() => handlePageChange(pageCount - 1)}
          disabled={currentPage === pageCount - 1}
          style={{ padding: "8px", border: "none", cursor: "pointer" }}
        >
          Last
        </button>
      </div>
    );
  };
  export default ComplexPagination;
  