import React from 'react';

export default function Footer() {
  return (
    <div style={{ height: "3vh", bottom: 0, width: "100%" }}>
      <footer className="bg-black text-white p-3">
        <div className="container text-center">
          <div className="row">
            <div className="col-md-4">
              <p>@SaiKarthik</p>
            </div>
            <div className="col-md-4">
              <p>@NagiReddy</p>
            </div>
            <div className="col-md-4">
              <p>@YashwanthReddy</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
