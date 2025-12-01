"use client";

import { useState, useEffect } from "react";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default function useFancybox(options = {}) {
	const [root, setRoot] = useState(null);

	useEffect(() => {
		if (!root) return;

		Fancybox.bind(root, "[data-fancybox]", options);

		return () => {
		Fancybox.unbind(root, "[data-fancybox]");
		};
	}, [root, options]);

	return [setRoot];
}
