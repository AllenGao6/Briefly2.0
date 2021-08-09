import React, { useState, useEffect, useRef } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  Container: {
    marginTop: 50,
    backgroundColor: "#f6f6f5",
    display: "flex",
    flexDirection: "row",
    padding: 5,
  },
  textSection: {
    display: "flex",
    marginLeft: 5,
  },
  Title: {
    fontSize: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  image: {
    height: 150,
    width: 200,
  },
  text: {
    fontSize: 10,
  },
});

export default function PdfNote({ mediaType, summarization, title }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.Title}>{title}</Text>
        {summarization.map((item, index) => (
          <View key={index} style={styles.Container}>
            <View style={styles.textSection}>
              <Text style={styles.text}>{item.sentence}</Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
