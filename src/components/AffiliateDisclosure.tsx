export function AffiliateDisclosure() {
  return (
    <div className="bg-gray-100 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-600">
        <strong>Affiliate Disclosure:</strong> As an Amazon Associate, HoopsHype earns from qualifying purchases. 
        When you buy through links on this page, we may earn a small commission at no extra cost to you.
      </p>
    </div>
  );
}

export function InlineDisclosure() {
  return (
    <p className="text-xs text-gray-500 mt-2">
      * As an Amazon Associate, we earn from qualifying purchases.
    </p>
  );
}
