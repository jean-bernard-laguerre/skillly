import { Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { type ComponentProps } from "react";
import { Platform } from "react-native";
import { ExternalLinkProps } from "@/types/interfaces";

export default function ExternalLink({ href, ...props }: ExternalLinkProps) {
  return (
    <Link
      target="_blank"
      {...props}
      href={href}
      onPress={async (event) => {
        if (Platform.OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href);
        }
      }}
    />
  );
}
