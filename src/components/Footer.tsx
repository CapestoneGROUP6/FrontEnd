import React from 'react';

export default function Footer() {
  return (
    <div style={{ height: "8vh", bottom: 0, position: 'fixed', width: "100%" }}>
      <footer className="bg-black text-white p-3">
        <div className="container">
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
