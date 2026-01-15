## Windows Home Edition: Enabling Lock Screen Overrides

Since Windows Home does not include the Group Policy Editor by default, follow these steps to configure lock screen behavior:

### 1. Enable Group Policy Editor
- Right-click the `enable-gpedit.cmd` script and select **Run as administrator**.
- Wait for the command prompt to finish the installation process.

### 2. Restart Your PC
- A full system restart is required to initialize the newly added Group Policy components.

### 3. Configure Policy Settings
- Press `Win + R`, type `gpedit.msc`, and press **Enter**.
- Navigate to the following path:
  `Computer Configuration` > `Administrative Templates` > `Control Panel` > `Personalization`
- To See if the Lockscreen
