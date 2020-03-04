import * as ChildProcess from 'child_process'

export interface ExecOptions extends ChildProcess.SpawnOptions {
  throwOnError?: boolean
}

export interface ExecEntry {
  command: string
  options: ExecOptions
}

export function exec( command: string, options: ExecOptions = { stdio: 'pipe' } ) {
  let cmd  = '/bin/bash'
  let args = [ '-c', command ]
  if (process.platform === 'win32') {
    cmd  = 'cmd'
    args = [ '/c', command ]
  }

  return new Promise<{ code: number, signal: string, data: Buffer }>((resolve, reject) => {
    const ps = ChildProcess.spawn( cmd, args, options )

    var data = Buffer.from('')

    ps.stdout.on('data', function(d) {
      data = Buffer.concat([ data, d ])
    })

    ps.on('error', (error) => {
      if (options.throwOnError) {
        reject( error )
      }
    })

    ps.on('exit', (code, signal) => {
      resolve({ code, signal, data })
    })
  })
}

export function execParallel( commands: Array<ExecEntry | string> ) {
  return Promise.all(commands.map((c) => {
    if (typeof c === 'string') {
      return exec( c )
    }
    return exec( c.command, c.options )
  }))
}

export async function execSerie( commands: Array<ExecEntry | string> ) {
  for (let i = 0; i < commands.length; i++) {
    const c = commands[i];
    if (typeof c === 'string') {
      await exec( c )
    } else {
      await exec( c.command, c.options )
    }
  }
}
