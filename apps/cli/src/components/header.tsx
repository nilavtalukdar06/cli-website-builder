export default function Header() {
  return (
    <box justifyContent="center" alignItems="center">
      <box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={0.5}
      >
        <ascii-font font="tiny" color="gray" text="Vibe" />
        <ascii-font font="tiny" color="white" text="Code" />
      </box>
    </box>
  );
}
