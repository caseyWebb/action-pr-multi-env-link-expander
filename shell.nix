{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_21
  ];

  shellHook = ''
    npm install
  '';
}
