import DOMPurify from "isomorphic-dompurify";

export function cleanHtml(html) {
	if (!html) return "";

	return DOMPurify.sanitize(html, {
		USE_PROFILES: { html: true },
		ADD_ATTR: ["target", "rel"], // можно расширять
	});
}
