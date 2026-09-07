"use client";

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ backgroundColor: "#065f46" }}>
        <Toolbar className="flex justify-between items-center">
          {/* Logo & Brand Title */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "0.95rem", sm: "1.1rem" },
            }}
          >
            <Link href="/" className="hover:text-emerald-200 transition">
              ครุภัณฑ์ คณะมนุษยศาสตร์และสังคมศาสตร์ มจษ.
            </Link>
          </Typography>

          {/* Desktop Navigation Links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 3,
            }}
          >
            <Link
              href="/"
              className="hover:text-emerald-200 text-sm font-medium transition"
            >
              หน้าหลัก
            </Link>
            <Link
              href="/productlist"
              className="hover:text-emerald-200 text-sm font-medium flex items-center gap-1 transition"
            >
              <InventoryIcon fontSize="small" />
              รายการครุภัณฑ์
            </Link>
            <Link
              href="/AddProduct"
              className="hover:text-emerald-200 text-sm font-medium flex items-center gap-1 transition"
            >
              <AddCircleOutlineIcon fontSize="small" />
              กรอกรายการครุภัณฑ์
            </Link>
            <Link
              href="/scan"
              className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition"
            >
              <QrCodeScannerIcon fontSize="small" />
              ตรวจเช็ค (QR Code)
            </Link>
          </Box>

          {/* Mobile Hamburger Button */}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
              backgroundColor: "#044e39",
              padding: 2,
              gap: 1.5,
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded hover:bg-emerald-800 text-white font-medium"
            >
              หน้าหลัก
            </Link>
            <Link
              href="/productlist"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded hover:bg-emerald-800 text-white font-medium flex items-center gap-2"
            >
              <InventoryIcon fontSize="small" />
              รายการครุภัณฑ์
            </Link>
            <Link
              href="/AddProduct"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded hover:bg-emerald-800 text-white font-medium flex items-center gap-2"
            >
              <AddCircleOutlineIcon fontSize="small" />
              กรอกรายการครุภัณฑ์
            </Link>
            <Link
              href="/scan"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded bg-emerald-600 text-white font-bold flex items-center gap-2"
            >
              <QrCodeScannerIcon fontSize="small" />
              ตรวจเช็คครุภัณฑ์ (QR Code)
            </Link>
          </Box>
        )}
      </AppBar>
    </Box>
  );
}
