"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";

export default function Footer() {
  return (
    <div>
      <footer className="footer footer-center bg-base-200 text-base-content rounded p-10">
        <nav className="grid grid-flow-col gap-4">
          <a href="/productlist" className="link link-hover">
            หน้าหลัก
          </a>
          {/* <a className="link link-hover">ติดต่อ</a> */}
          <a href="/productlist" className="link link-hover">
            รายการครุภัณฑ์
          </a>
          <a href="/AddProduct" className="link link-hover">
            กรอกรายการครุภัณฑ์
          </a>
        </nav>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <a>
              <Button variant="contained" size="large">
                <TwitterIcon />
              </Button>
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="contained" size="large" color="error">
                <YouTubeIcon />
              </Button>
            </a>
            <a>
              <Button variant="contained" size="large" color="success">
                <FacebookIcon />
              </Button>
            </a>
          </div>
        </nav>
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by
            Chandrakasem Rajabhat University
          </p>
        </aside>
      </footer>
    </div>
  );
}
