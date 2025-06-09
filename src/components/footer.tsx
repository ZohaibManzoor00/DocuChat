export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="flex justify-between p-5 items-center">
        <p className="text-sm font-medium flex justify-end w-full p-4 text-muted-foreground">
          ©{currentYear} Zohaib Manzoor
        </p>
      </div>
    </footer>
  );
}
