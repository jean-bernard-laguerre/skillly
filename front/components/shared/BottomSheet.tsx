import React from "react";
import { View, Text, ScrollView, StyleSheet, Animated } from "react-native";
import { Portal } from "react-native-portalize";
import { useBottomSheet } from "@/lib/hooks/useBottomSheet";

export interface BottomSheetProps {
  isVisible: boolean;
  isSheetVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  height?: string;
}

export default function BottomSheet({
  isVisible,
  isSheetVisible,
  onClose,
  children,
  title,
  height = "70%",
}: BottomSheetProps) {
  const { slideAnim, backdropAnim, panResponder } = useBottomSheet({
    isVisible,
    onClose,
  });

  if (!isSheetVisible) return null;

  return (
    <Portal>
      <Animated.View style={[styles.modalBackdrop, { opacity: backdropAnim }]}>
        <Animated.View
          style={[
            styles.modalSheet,
            { height: height as any, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.modalHandle} {...panResponder.panHandlers}>
            <View style={styles.handleBar} />
          </View>

          {title && (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>
          )}

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    zIndex: 100,
  },
  modalSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignSelf: "flex-end",
    width: "100%",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHandle: {
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleBar: {
    width: 48,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
  },
  titleContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
});
