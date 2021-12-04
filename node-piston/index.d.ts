interface options {
    language: string,
    version: string,
    files: {
        name?: string,
        content: string
    }[],
    stdin?: string,
    args?: string[],
    compileTimeout: number
    runTimeout?: number, 
    compileMemoryLimit?: number,
    runMemoryLimit?: number
}

interface executeOutput {
    language: string,
    version: string,
    run: {
        stdout: string,
        stderr: string, 
        code: number,
        signal: null
    }
}

interface executeError {
    succes: boolean,
    error: Error
}

interface runtimeOutput {
    language: string,
    version: string,
    aliases: string[]
}

export const piston: (opts?: {}) => {
    runtimes(): Promise<runtimeOutput[]>;
    execute(language: string, code: string, options?: options): Promise<executeOutput>;
}

export default piston