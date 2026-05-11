import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#fdfdfd' },
  header: { borderBottom: '2px solid #064e3b', paddingBottom: 15, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#064e3b' },
  subtitle: { fontSize: 10, color: '#6b7280', textTransform: 'uppercase' },
  date: { fontSize: 10, color: '#6b7280', textAlign: 'right' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: 5, marginBottom: 10, marginTop: 20 },
  text: { fontSize: 10, color: '#4b5563', lineHeight: 1.5, marginBottom: 10 },
  table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: '#e5e7eb', borderRightWidth: 0, borderBottomWidth: 0, marginTop: 10 },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableColHeader: { width: "33.33%", borderStyle: "solid", borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f3f4f6', padding: 5 },
  tableCol: { width: "33.33%", borderStyle: "solid", borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#e5e7eb', padding: 5 },
  tableCellHeader: { fontSize: 10, fontWeight: 'bold', color: '#374151' },
  tableCell: { fontSize: 9, color: '#4b5563' },
  impactGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 15 },
  impactCard: { width: '30%', backgroundColor: '#f9fafb', padding: 10, borderRadius: 5, border: '1px solid #e5e7eb', textAlign: 'center' },
  impactLabel: { fontSize: 8, color: '#6b7280', textTransform: 'uppercase', marginBottom: 5 },
  impactValue: { fontSize: 14, fontWeight: 'bold', color: '#047857' },
  spoBox: { backgroundColor: '#f0fdf4', padding: 15, borderRadius: 5, border: '1px solid #bbf7d0', marginTop: 10 },
  spoTitle: { fontSize: 12, fontWeight: 'bold', color: '#166534', marginBottom: 5 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', color: '#9ca3af', fontSize: 8, borderTop: '1px solid #e5e7eb', paddingTop: 10 }
});

export const PDFReport = ({ reportType, investmentAmount = 1000 }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Eco-Capital</Text>
          <Text style={styles.subtitle}>Institutional Impact Report</Text>
        </View>
        <View>
          <Text style={styles.date}>Date: {new Date().toLocaleDateString()}</Text>
          <Text style={styles.date}>ID: RPT-2026-X89</Text>
        </View>
      </View>

      <View style={{ textAlign: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>{reportType}</Text>
        <Text style={{ fontSize: 9, color: '#6b7280', marginTop: 5 }}>Aligned with the ICMA Harmonised Framework for Impact Reporting</Text>
      </View>

      <View>
        <Text style={styles.sectionTitle}>1. Detailed Allocation Reporting</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Project & Location</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Sector</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Allocated ($)</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Solar Array Alpha (India)</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Renewable Energy</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>${(investmentAmount * 0.45).toFixed(2)}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Coastal Mangroves (India)</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Biodiversity</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>${(investmentAmount * 0.30).toFixed(2)}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Pending Deployment</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Unallocated</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>${(investmentAmount * 0.25).toFixed(2)}</Text></View>
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>2. Pro-Rata Environmental Impact</Text>
        <Text style={styles.text}>Calculated based on your specific ${investmentAmount.toFixed(2)} fractional holding.</Text>
        <View style={styles.impactGrid}>
          <View style={styles.impactCard}>
            <Text style={styles.impactLabel}>CO2 Avoided (Tons)</Text>
            <Text style={styles.impactValue}>{(investmentAmount * 0.0125).toFixed(2)}</Text>
          </View>
          <View style={styles.impactCard}>
            <Text style={styles.impactLabel}>Clean Energy (MWh)</Text>
            <Text style={styles.impactValue}>{(investmentAmount * 0.0042).toFixed(2)}</Text>
          </View>
          <View style={styles.impactCard}>
            <Text style={styles.impactLabel}>Water Saved (m3)</Text>
            <Text style={styles.impactValue}>{(investmentAmount * 0.85).toFixed(0)}</Text>
          </View>
        </View>
        <Text style={styles.text}>Qualitative Outcome: Funds successfully supported the installation of 50kW solar capacity. Environmental risk mitigation strategies remain strictly enforced per ISO 14001 guidelines to ensure zero negative ecological side-effects during construction phases.</Text>
      </View>

      <View>
        <Text style={styles.sectionTitle}>3. External Verification</Text>
        <View style={styles.spoBox}>
          <Text style={styles.spoTitle}>Verified by Sustainalytics</Text>
          <Text style={{ fontSize: 9, color: '#166534' }}>A Second Party Opinion (SPO) has confirmed that the use of proceeds aligns fully with the Green Bond Principles 2021.</Text>
        </View>
      </View>

      <Text style={styles.footer}>CONFIDENTIAL & PROPRIETARY. Generated by Green Bond Impact Reporter.</Text>
    </Page>
  </Document>
);
